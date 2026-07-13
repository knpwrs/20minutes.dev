---
project: build-a-sql-database
lesson: 6
title: Scanning into a result set
overview: Every query returns a result set - named columns plus rows. Today you build that shape and the scan that turns a whole table into one, the first operator in your execution pipeline.
goal: Scan a table into a result set that carries the column names and every row in order.
spec:
  scenario: Scanning a table into a result set
  status: failing
  lines:
    - kw: Given
      text: 'a table "users" with columns (id, name) holding rows [1, "alice"] and [2, "bob"]'
    - kw: When
      text: the table is scanned into a result set
    - kw: Then
      text: 'the result set columns are ["id", "name"]'
    - kw: And
      text: 'its rows are [1, "alice"] and [2, "bob"] in that order'
code:
  lang: go
  source: |
    // the currency of the whole engine: named columns + rows
    type ResultSet struct { Columns []string; Rows []Row }
    func Scan(t *Table) ResultSet {
      // column names from the schema, rows copied straight through
    }
checkpoint: A table becomes a result set with named columns - the shape every operator speaks. Commit and stop here.
---

Queries do not return tables; they return **result sets** - a list of column
names and the rows under them. Making this its own type is the key design
decision of the execution engine: every operator you build (filter, project,
sort, join) will take result sets and return result sets, so they snap together
into a pipeline without caring where the rows originally came from.

**Scan** is the source at the bottom of every pipeline: it reads a table and
produces the result set of *all* its rows, columns named straight from the
schema. It does no filtering and no reshaping - just lifts stored data into the
form queries consume. From here on, "run a query" means "start with a scan and
transform the result set."
