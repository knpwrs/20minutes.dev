---
project: build-a-sql-database
lesson: 40
title: Loading from disk
overview: The final piece closes the loop - reading a saved database back into memory so your data survives a restart. Today you load the file and prove a full round trip.
goal: Load a database from a saved file and confirm a save-then-load round trip reproduces the original data.
spec:
  scenario: Round-tripping the database through disk
  status: failing
  lines:
    - kw: Given
      text: 'a database with users(id INTEGER, name TEXT) holding [1, "alice"] and [2, "bob"], saved to a file'
    - kw: When
      text: a fresh database is loaded from that file
    - kw: Then
      text: 'it has a users table with the same schema and the same two rows in order'
    - kw: And
      text: 'querying "SELECT name FROM users WHERE id = 2" on the loaded database returns ["bob"]'
code:
  lang: go
  source: |
    // parse the file format from lesson 39 back into tables:
    //   TABLE -> create table; COL -> add column; ROW -> insert values
    // rebuild each Value from its kind tag so types are restored
    // wire the REPL to load on startup and save on exit
checkpoint: Your database saves and loads its data, so a full save-then-load round trip survives a clean restart. Next you make that persistence crash-safe. Commit and stop here.
---

**Loading** reverses lesson 39: read the file line by line, and rebuild the
database - a table header creates a table, a column line extends its schema, a row
line inserts values reconstructed from their kind tags so an integer comes back an
integer and a `NULL` comes back a `NULL`. A save-then-load round trip must
reproduce the original tables exactly, and a query against the loaded database
must return the same answers as against the original.

Wire load-on-startup and save-on-exit into the REPL and the walking skeleton
becomes a **real, persistent SQL database**: create tables, insert and query data,
join and aggregate across tables, mutate rows, quit, restart, and find your data
waiting. You have built - from a single typed value - a tokenizer, a
recursive-descent parser, a relational execution engine, and durable storage.
That storage survives a clean restart - but not yet a crash mid-save, which can
still tear the file or lose the mutations since the last save. The next chapter
closes that gap and makes persistence genuinely crash-safe.
