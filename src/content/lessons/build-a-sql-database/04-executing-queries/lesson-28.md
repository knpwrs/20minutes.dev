---
project: build-a-sql-database
lesson: 28
title: 'The REPL'
overview: Your engine can run SQL - now let a person type it. Today you build the read-eval-print loop that tokenizes, parses, and executes a line of SQL and prints the result.
goal: Build a loop that reads a SQL statement, runs it end to end, and prints the result set or an error.
spec:
  scenario: Running statements through the REPL
  status: failing
  lines:
    - kw: Given
      text: "the input lines \"CREATE TABLE t (id INTEGER);\", \"INSERT INTO t VALUES (1);\", \"SELECT * FROM t;\""
    - kw: When
      text: they are fed to the REPL in order
    - kw: Then
      text: "the SELECT prints a grid whose header is \"id\" and whose next line is \"1\""
    - kw: And
      text: a statement with a syntax error prints an error message and the loop continues
code:
  lang: go
  source: |
    // read statements (split the input on ';'), then for each:
    //   Tokenize -> Parse -> db.Exec
    // on error, print it and keep going (don't crash the loop)
    // on a result set, print Format(rs); DDL/INSERT can print "ok"
checkpoint: You have an interactive SQL prompt - type a statement, see the result. Commit and stop here.
---

This is the lesson the project becomes a **database you use**. A **REPL** -
read-eval-print loop - reads a statement, runs it through the full stack you have
built (tokenize, parse, execute), and prints the outcome: a formatted grid for a
`SELECT`, a short acknowledgement for `CREATE`/`INSERT`, and a readable error for
anything malformed. Crucially, an error prints and the loop *continues* - one bad
query should never kill the session.

Wire it to read lines from standard input so you can pipe a `.sql` file in or type
interactively. Everything from here on - ordering, limits, aggregates, joins -
becomes usable the instant you implement it, because this loop already turns text
into answers. Make each later lesson's feature runnable at this prompt and you keep a
true walking skeleton to the end.
