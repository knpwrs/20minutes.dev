---
project: build-a-sql-database
lesson: 3
title: Column definitions and the schema
overview: A schema names the columns and fixes their types, turning a positional row into something you can query by name. Today you build the schema that maps a column name to its index and type.
goal: Build a schema from ordered column definitions and look up a column's index and type by name.
spec:
  scenario: Looking up a column in a schema
  status: failing
  lines:
    - kw: Given
      text: 'a schema with columns (id INTEGER), (name TEXT), (age INTEGER)'
    - kw: When
      text: 'the column "name" is looked up'
    - kw: Then
      text: its index is 1 and its type is TEXT
    - kw: And
      text: 'looking up an unknown column "zzz" reports not found'
code:
  lang: go
  source: |
    type Column struct { Name string; Type Kind }
    type Schema struct { Columns []Column }
    // return the index and whether it was found
    func (s Schema) IndexOf(name string) (int, bool) { /* linear scan */ }
checkpoint: A schema maps column names to positions and types. Commit and stop here.
---

A row is positional, but SQL is written in **names** - `SELECT name FROM users`
never mentions "column 1." The **schema** bridges the two: an ordered list of
column definitions, each a name paired with a type, where a column's position in
that list *is* its index into every row. Look up `"name"`, get back index `1`,
and now you can pull field 1 out of any row of this table.

This name-to-index lookup is the single most reused operation in the whole
engine. Every expression that references a column, every projection that selects
one, and every join that matches on one will call it. A plain linear scan over a
handful of columns is exactly the right amount of machinery today.
