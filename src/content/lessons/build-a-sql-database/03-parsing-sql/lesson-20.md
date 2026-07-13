---
project: build-a-sql-database
lesson: 20
title: Parsing CREATE TABLE
overview: The parser has read queries; now it reads schema. Today you parse a CREATE TABLE statement into a node listing each column's name and type.
goal: Parse CREATE TABLE with a parenthesized list of typed columns into a create-table statement node.
spec:
  scenario: Parsing a CREATE TABLE statement
  status: failing
  lines:
    - kw: Given
      text: 'the statement "CREATE TABLE users (id INTEGER, name TEXT)"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the result is a CreateTable for "users" with columns [(id, INTEGER), (name, TEXT)]'
    - kw: And
      text: an unknown type keyword reports an error
code:
  lang: go
  source: |
    type CreateStmt struct { Table string; Columns []Column } // also a Stmt
    // add a CREATE case to Parse's keyword dispatch -> parseCreate
    // parseCreate: expect(CREATE); expect(TABLE); table = expect(Identifier)
    //   expect(LParen); loop: name=Identifier, type keyword (INTEGER|TEXT),
    //   separated by commas; expect(RParen)
checkpoint: The parser turns CREATE TABLE into a statement carrying its column definitions. Commit and stop here.
---

So far every statement has been a query; `CREATE TABLE` is the first that changes
the database's structure. This is exactly why `Parse` dispatched on the leading
keyword back on lesson 15: today you add a second route. `CREATE` steers to a new
`parseCreate`, and `CreateStmt` satisfies the same `Stmt` marker as `SelectStmt`,
so nothing about `Parse`'s shape changes - you just slot in the case. Its grammar
is a header - `CREATE TABLE` and a name - followed by a parenthesized,
comma-separated list of **column definitions**, each a name and a type keyword.
Parsing it reuses everything you have: `expect` for the fixed keywords and
punctuation, an identifier for each name, and a small set of recognized type
keywords (`INTEGER`, `TEXT`) mapping to the `Kind` values from lesson 1.

Rejecting an unknown type - `id FLOATY` - with a clear error is part of the job;
the parser is the first place a nonsense schema should be caught. The `Column`
type you built for the schema is exactly what these definitions produce, so the
executor will be able to hand the list straight to `CreateTable` next chapter.
