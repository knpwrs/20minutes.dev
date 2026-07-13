---
project: build-a-sql-database
lesson: 8
title: 'Demo: printing a result set'
overview: Time to see your engine work end to end. Today you format a result set as a text grid and drive the whole stack by hand - create a table, insert rows, scan, and print.
goal: Format a result set as an aligned text grid with a header row, and print the result of a hand-built query.
spec:
  scenario: Rendering a result set as a text grid
  status: failing
  lines:
    - kw: Given
      text: 'a result set with columns [id, name] and rows [1, "alice"] and [2, "bob"]'
    - kw: When
      text: the result set is formatted as a grid
    - kw: Then
      text: 'the first line is "id | name"'
    - kw: And
      text: 'the following lines are "1 | alice" and "2 | bob"'
code:
  lang: go
  source: |
    func Format(rs ResultSet) string {
      // join column names with " | " for the header
      // then each row's values rendered the same way, one line each
    }
    // in main(): create users, insert two rows, print Format(Scan(users))
checkpoint: You can create a table, insert rows, scan them, and print a formatted result - the whole first chapter runs. Commit and stop here.
---

Everything so far has been parts; today they run together. A **formatter** turns
a result set into text a person can read: a header line of column names, then one
line per row, values separated by a divider. Keep it simple - a single-space
`" | "` separator is enough to make the output legible.

Wire it into a tiny `main` that builds the `users` table, inserts a couple of
rows, scans it, and prints the grid. That hand-written driver is your **walking
skeleton**: proof the value, row, schema, table, database, scan, and formatter
all fit. From here the SQL front-end will replace the hand-built parts one at a
time, but the pipeline it feeds is already alive.
