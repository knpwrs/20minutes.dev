---
project: build-a-toml-parser
lesson: 21
title: Nested table headers
overview: 'Grouping goes deeper than one level. Today you parse a dotted table header, which names a nested table and creates the intermediate tables along the way.'
goal: 'Parse a [a.b.c] header, creating intermediate tables a and b.'
spec:
  scenario: A dotted table header
  status: failing
  lines:
    - kw: Given
      text: 'the document with a line reading open-bracket a.b.c close-bracket, then x = 1'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'the root has a table a, containing a table b, containing a table c, containing x with the integer 1'
    - kw: And
      text: 'each dotted segment names one level, and a quoted segment such as "b.c" is a single key with a dot in its name, not two levels'
code:
  lang: go
  source: |
    // split the header name on '.' into segments (respecting quotes)
    // walk from the root, and for each segment:
    //   if a child table with that name exists, descend into it
    //   otherwise create it, then descend
    // set current = the deepest table
checkpoint: 'Dotted headers build nested tables, creating intermediates. Commit and stop here.'
---

Real config nests more than one level deep - `[servers.alpha.network]` - and TOML
writes that as a **dotted table header**. Each dot separates a level, so `[a.b.c]`
names the table `c` inside `b` inside `a`. If any of those intermediate tables does
not exist yet, the header **creates it on the way down**, so a single header can
bring a whole branch into being.

Implement it by splitting the header name into segments and walking from the root,
descending into each named child and creating it when it is missing, until you reach
the last segment; that deepest table becomes the new current table. One subtlety in
the split: a **quoted segment** is one key even if it contains a dot, so
`["b.c"]` (with the quotes) is a single table named `b.c`, whereas `[b.c]` (bare) is
`c` inside `b`. Respecting quotes while splitting keeps names with dots intact, the
same way quoted keys did back in the first chapter.
