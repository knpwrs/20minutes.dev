---
project: build-a-sql-database
lesson: 21
title: 'Demo: parsing INSERT and a script'
overview: The last statement the parser needs is INSERT, and then it can read a whole script. Today you parse INSERT INTO ... VALUES and split a multi-statement string on semicolons.
goal: Parse an INSERT statement into a node holding the table and value list, and parse a semicolon-separated script into a list of statements.
spec:
  scenario: Parsing INSERT and a multi-statement script
  status: failing
  lines:
    - kw: Given
      text: "the statement \"INSERT INTO users VALUES (1, 'alice')\""
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the result is an Insert for "users" with values [IntLit(1), StrLit(alice)]'
    - kw: And
      text: 'a script of two statements separated by ";" parses into a list of two statement nodes'
code:
  lang: go
  source: |
    type InsertStmt struct { Table string; Values []Expr }
    // expect(INSERT INTO) name (VALUES) LParen expr-list RParen
    // ParseScript: parse a statement, expect Semicolon, repeat until EOF
checkpoint: The parser handles INSERT and can parse a whole script of statements. Commit and stop here.
---

`INSERT INTO users VALUES (1, 'alice')` completes the core statement set. Its
value list is a parenthesized, comma-separated run of **expressions** - reuse the
atom parser from lesson 16, so a value can be any literal - stored on an `Insert`
node beside the table name. Parsing statements now means peeking at the leading
keyword (`SELECT`, `CREATE`, `INSERT`) and dispatching to the matching rule.

The demo ties the chapter off: **parse a script**. Given several statements
separated by semicolons, parse one, expect the semicolon, and repeat until `EOF`,
collecting a list of statement nodes. That list is precisely what the executor
will loop over next chapter - one parsed statement at a time, run in order. The
front-end is done; time to make these trees *do* something.
