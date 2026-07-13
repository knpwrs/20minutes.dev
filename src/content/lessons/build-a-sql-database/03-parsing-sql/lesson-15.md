---
project: build-a-sql-database
lesson: 15
title: Parsing SELECT and FROM
overview: Now the parser produces its first statement. Today you turn "SELECT a, b FROM t" into a select node that names its columns and its table.
goal: Parse a SELECT of a comma-separated column list and a FROM table into a select statement node, including SELECT *.
spec:
  scenario: Parsing a column list and table name
  status: failing
  lines:
    - kw: Given
      text: 'the statement "SELECT id, name FROM users"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the result is a Select with columns ["id", "name"] and table "users"'
    - kw: And
      text: '"SELECT * FROM users" parses with a star (all columns) marker'
code:
  lang: go
  source: |
    type Stmt interface{}   // marker: every statement node satisfies this
    type SelectStmt struct { Star bool; Columns []string; From string }
    // Parse(input) -> (Stmt, error): peek the leading keyword to pick a rule.
    //   today only SELECT exists, so route SELECT -> parseSelect.
    // parseSelect: expect(SELECT); if peek is Star -> Star=true, else a name list
    //   then expect(FROM); the table is expect(Identifier)
checkpoint: The parser turns a basic SELECT ... FROM into a statement node. Commit and stop here.
---

Time for the parser's first real grammar rule. A `SELECT` statement in its
simplest form is the keyword `SELECT`, a **column list**, the keyword `FROM`,
and a **table name**. Following the tokens: match `SELECT`, then read a
comma-separated list of identifiers, then match `FROM`, then read one identifier
for the table.

Give the top-level `Parse` one small habit now that pays off all chapter: have it
**peek the leading keyword and dispatch** to the matching rule, returning a shared
`Stmt` type (an empty marker interface is enough). Today only `SELECT` exists, so
there is just one route - but `CREATE` and `INSERT` will slot in as sibling cases
later without reshaping `Parse`. The `*` case is worth handling now because it is
so common: `SELECT *` means "all columns," which the executor treats differently
from a fixed list, so record it as a flag on the node rather than a phantom column
named `"*"`. The result is a **syntax tree node** - a plain struct capturing what
the query asked for, completely separate from how it will run.
