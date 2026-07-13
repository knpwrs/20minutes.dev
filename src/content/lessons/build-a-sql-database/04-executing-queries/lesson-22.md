---
project: build-a-sql-database
lesson: 22
title: The executor and CREATE TABLE
overview: The parser makes trees; the executor makes them happen. Today you build the executor and its first case - running a CREATE TABLE node to add a real table to the database.
goal: Execute a parsed CREATE TABLE statement so the named table with its schema exists in the database.
spec:
  scenario: Executing a CREATE TABLE statement
  status: failing
  lines:
    - kw: Given
      text: 'an empty database and a parsed CreateTable for "users" with columns (id INTEGER), (name TEXT)'
    - kw: When
      text: the statement is executed
    - kw: Then
      text: 'the database has a table "users" with that two-column schema'
    - kw: And
      text: executing the same CreateTable again reports a duplicate-table error
code:
  lang: go
  source: |
    func (db *Database) Exec(stmt Stmt) (ResultSet, error) {
      switch s := stmt.(type) {
      case CreateStmt:
        _, err := db.CreateTable(s.Table, Schema{Columns: s.Columns})
        return ResultSet{}, err
      }
    }
checkpoint: The executor runs CREATE TABLE, turning a parsed statement into a real table. Commit and stop here.
---

The **executor** is the bridge between the syntax tree and the storage from
chapter 1. It is one function that takes a parsed statement and does what it says,
dispatching on the statement's type. The first and simplest case is
`CREATE TABLE`: pull the name and columns off the node and call the `CreateTable`
method the database already has.

Notice how little glue this takes - the parser produced `Column` values, the
database knows how to register a schema, and the executor just connects them. The
duplicate-table error you built on lesson 7 surfaces here automatically, which is the
payoff of validating at the storage layer. Every other statement type is another
`case` in this same switch; you will fill them in over the next several lessons.
