---
project: build-a-sql-database
lesson: 7
title: The database
overview: A database is a named collection of tables. Today you build the registry that creates tables by name and hands them back, so queries can refer to a table by the name in the SQL.
goal: Create tables by name in a database, fetch them back, and reject a duplicate name.
spec:
  scenario: Creating and fetching tables by name
  status: failing
  lines:
    - kw: Given
      text: an empty database
    - kw: When
      text: 'a table "users" is created and then fetched by name'
    - kw: Then
      text: the same table is returned
    - kw: And
      text: 'creating "users" a second time reports an error'
    - kw: And
      text: 'fetching an unknown table "ghosts" reports not found'
code:
  lang: go
  source: |
    type Database struct { tables map[string]*Table }
    func (db *Database) CreateTable(name string, s Schema) (*Table, error) {
      // error if name already exists, else store and return a new *Table
    }
    func (db *Database) Table(name string) (*Table, bool) { /* map lookup */ }
checkpoint: A database holds named tables and refuses duplicates - the top-level object a query runs against. Commit and stop here.
---

The **database** is the outermost object: a map from table name to table. When a
query says `FROM users`, the engine asks the database for the table named
`"users"`. Creating a table registers a fresh, empty table under its name;
asking for one by name hands it back so rows can be inserted or scanned.

Two rules keep it honest. Creating a table whose name already exists is an error
- you should not silently clobber existing data - and fetching a name that was
never created reports "not found" rather than inventing an empty table. These
are the same errors a real `CREATE TABLE` and a query against a missing table
raise, and wiring them in now means the executor gets them for free later.
