---
project: build-a-toml-parser
lesson: 23
title: Duplicate keys and tables
overview: 'TOML forbids defining the same thing twice, and a good parser says so with a position. Today you give errors a line and column and enforce the core duplicate rules.'
goal: 'Report a positioned error when a key or table is defined twice.'
spec:
  scenario: Redefinition errors
  status: failing
  lines:
    - kw: Given
      text: 'documents that define the same name twice'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'a = 1 then a = 2 fails with a message like key "a" already defined at line 2, column 1, and open-bracket a close-bracket twice fails with table "a" already defined'
    - kw: And
      text: 'defining a key then a table with the same name, a = 1 then open-bracket a close-bracket, is also an error because a is already a value'
code:
  lang: go
  source: |
    // ParseError.Error(): fmt.Sprintf("%s at line %d, column %d", Msg, Line, Col)
    // before setting a key: if it already exists in the table -> error
    // before a [header]: if the final segment exists AND is not a
    //   header-created table -> error ("already defined")
    // track which tables were created explicitly by a header
checkpoint: 'Duplicate keys and tables fail with a line and column. Commit and stop here.'
---

TOML's data model says a key is defined **once**. Setting `a = 1` and then `a = 2`
is not last-wins here (as it was in JSON) - it is an **error**, because the document
is contradicting itself. The same holds for tables: two `[a]` headers both claim to
define table `a`, which is not allowed, and mixing kinds - `a = 1` then `[a]` - is an
error too, since `a` is already a value and cannot also be a table. Catching these
keeps a config honest about what it declares.

This is where errors get **positions**. Give `ParseError` an `Error()` that renders
`<message> at line L, column C`, and carry the offending line and column into it so
a reader can jump straight to the problem. Enforcing the rules means checking before
you write: a key that already exists, or a header whose table was already defined,
raises the error instead of overwriting. The one nuance to track, which the next
lesson builds on, is **how** a table came to exist - a table created implicitly as
an intermediate is not yet "defined" and may still be defined once explicitly.
