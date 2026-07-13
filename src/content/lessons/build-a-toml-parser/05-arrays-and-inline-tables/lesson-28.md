---
project: build-a-toml-parser
lesson: 28
title: Arrays of tables
overview: 'Config often has a list of like-shaped sections, such as several products. Today you parse an array of tables, a double-bracket header that appends a new table element each time it appears.'
goal: 'Parse [[name]] headers that append a table element per occurrence.'
spec:
  scenario: Repeated double-bracket headers
  status: failing
  lines:
    - kw: Given
      text: 'the document open-bracket-bracket products close-bracket-bracket then name = "A", then open-bracket-bracket products close-bracket-bracket then name = "B"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'products is an array of two tables: the first has name "A", the second has name "B"'
    - kw: And
      text: 'pairs after each double-bracket header go into that occurrence, and the current table becomes the newly appended element'
code:
  lang: go
  source: |
    // a line [[ name ]] is an array-of-tables header:
    //   find or create an array value at `name`
    //   append a NEW empty table to it
    //   set current = that new table
    // a second [[name]] appends another element (does not redefine)
checkpoint: 'Double-bracket headers append a table per occurrence. Commit and stop here.'
---

When a document has several sections of the **same shape** - a list of products,
servers, or fruits - TOML uses an **array of tables**, written with double brackets:
`[[products]]`. Each time that header appears, it **appends a new table** to the
array named `products`, and the pairs that follow fill in that newest element. So
two `[[products]]` headers produce a two-element array, each element the table its
following pairs describe.

This is the one header form that is **not** a redefinition when repeated - that is
its entire purpose. The first `[[products]]` creates the array and its first table;
the second finds the existing array and appends a second table, rather than
erroring. The current-table pointer moves to the **freshly appended element**, so
`name = "A"` after the first header and `name = "B"` after the second land in
different tables. This gives TOML its way of expressing ordered, repeated records
without any outer list syntax, and the next lesson lets those records hold subtables
of their own.
