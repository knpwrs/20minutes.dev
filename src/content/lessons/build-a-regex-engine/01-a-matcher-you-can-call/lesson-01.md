---
project: build-a-regex-engine
lesson: 1
title: Parsing literals into a tree
overview: Today you turn a pattern string into a small syntax tree - the structure every later feature hangs off. Working from a tree instead of poking at the raw string is what will let you add stars, groups, and alternation cleanly.
goal: Parse a pattern of plain characters into a Concat node holding one Literal per character.
spec:
  scenario: Parsing a literal pattern into an AST
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "abc"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: "the result is Concat[Literal 'a', Literal 'b', Literal 'c']"
    - kw: And
      text: 'parsing "" yields an empty Concat (Concat with no children)'
code:
  lang: go
  source: |
    // one node kind per pattern construct; today just two
    type Literal struct{ Ch byte }
    type Concat struct{ Nodes []any }

    // walk the pattern left to right, one Literal per byte
    func parse(pat string) Concat { /* ... */ }
checkpoint: Your parser turns a plain string into a tree of Literal nodes. Commit and stop here.
---

A regex engine is really two machines glued together: a **parser** that reads the
pattern text into a tree, and a **matcher** that walks that tree against input.
Today is the parser's first step. A pattern like `abc` is a **concatenation** of
three single-character matches, so it becomes a `Concat` node holding three
`Literal` nodes - one per byte.

It is tempting to skip the tree and match against the raw pattern string, and for
the very simplest features you could. But `(ab|cd)*` has structure a flat string
can't express, and building the tree now means every feature you add later is just
one more node kind. Start with `Literal` and `Concat`; the rest of the syntax will
hang off this same shape.
