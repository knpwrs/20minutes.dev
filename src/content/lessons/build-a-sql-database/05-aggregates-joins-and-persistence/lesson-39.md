---
project: build-a-sql-database
lesson: 39
title: Saving to disk
overview: An in-memory database vanishes when the process exits. Today you serialize the whole database - schemas and rows - to a text file so it can outlive the program.
goal: Serialize a database to a text file capturing every table's schema and rows.
spec:
  scenario: Serializing the database to a file
  status: failing
  lines:
    - kw: Given
      text: 'a database with table users(id INTEGER, name TEXT) holding [1, "alice"]'
    - kw: When
      text: 'the database is saved to "db.txt"'
    - kw: Then
      text: 'the file records the table name, its columns and types, and the row values'
    - kw: And
      text: 'a null value and a text value round-trip distinctly (are not confused)'
code:
  lang: go
  source: |
    // choose a simple line format, e.g.:
    //   TABLE users
    //   COL id INTEGER
    //   COL name TEXT
    //   ROW 1 | alice
    // tag each value with its kind so null and "" survive the round trip
checkpoint: The database can write its full contents to a file. Commit and stop here.
---

Everything so far lives in memory and dies with the process. **Serialization**
fixes that: walk every table, and write its name, its column definitions, and
each of its rows to a file in a format you can read back. A simple line-oriented
text format - a line per table header, per column, per row - is easy to write and
easy to debug by eye.

The one trap is preserving **types**: an empty text value and a `NULL` must not
collapse into the same thing on disk, so tag each stored value with its kind (or
use an unambiguous encoding). Get the writing right today and reconstruction
becomes straightforward tomorrow, giving the engine durable storage - the feature
that separates a toy from a database you would actually keep data in.
