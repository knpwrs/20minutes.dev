---
project: build-a-toml-parser
lesson: 27
title: Inline tables
overview: 'A whole table can be written as a single value. Today you parse an inline table, a brace-enclosed set of pairs, self-contained on one line.'
goal: 'Parse a brace-enclosed inline table of key/value pairs.'
spec:
  scenario: A brace-enclosed table
  status: failing
  lines:
    - kw: Given
      text: 'the value point set to open-brace x = 1, y = 2 close-brace'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'point is a table with entries x (integer 1) then y (integer 2)'
    - kw: And
      text: 'an empty inline table open-brace close-brace has zero entries, inline tables nest as open-brace a = open-brace b = 1 close-brace close-brace, and a newline inside an inline table is an error'
code:
  lang: go
  source: |
    // parseValue: a leading '{' starts an inline table
    //   loop: parse a key (reuse the key parser, dotted allowed)
    //         expect '='; parse a value (recurse)
    //         set it in the new table; expect ',' or '}'
    // NO newlines allowed inside; no trailing comma allowed
checkpoint: 'Inline tables parse a table as a single-line value. Commit and stop here.'
---

An **inline table** packs a whole table into one value using braces:
`{ x = 1, y = 2 }`. It is the value-position counterpart to the `[header]` form -
same idea, a set of key/value pairs, but written inline where a value goes, which
suits small, obviously-grouped data like a coordinate or an RGB color. Parsing
mirrors the array loop, but each element is a `key = value` pair rather than a bare
value, so it reuses the key parser and the value parser together.

Inline tables are deliberately **strict and self-contained**. Unlike arrays, they
must sit on a single line - **a newline inside is an error** - and they allow **no
trailing comma**. Within them, dotted keys and nested inline tables work as
elsewhere (`{ a = { b = 1 } }` nests), and an **empty** inline table `{}` is valid.
The strictness is a design choice: an inline table is meant to be a compact,
complete literal, not an open section you add to later - a property the semantics
chapter leans on when it forbids extending one after the fact.
