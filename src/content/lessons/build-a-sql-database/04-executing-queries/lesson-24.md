---
project: build-a-sql-database
lesson: 24
title: Evaluating expressions against a row
overview: To run a query you must compute an expression's value for a given row. Today you build the evaluator for the two atoms - a literal yields itself, a column reference reads the row.
goal: Evaluate a literal or column-reference expression against a row and its schema to produce a value.
spec:
  scenario: Evaluating atoms against a row
  status: failing
  lines:
    - kw: Given
      text: 'the schema (id INTEGER), (name TEXT) and the row [7, "alice"]'
    - kw: When
      text: the column reference "name" is evaluated
    - kw: Then
      text: 'the result is the text value "alice"'
    - kw: And
      text: evaluating the literal 42 yields the integer value 42
    - kw: And
      text: 'evaluating an unknown column "zzz" reports an error'
code:
  lang: go
  source: |
    func Eval(e Expr, row Row, s Schema) (Value, error) {
      switch e := e.(type) {
      case IntLit: return Value{Kind: KindInt, Int: e.Value}, nil
      case StrLit: return Value{Kind: KindText, Text: e.Value}, nil
      case ColRef: /* schema.IndexOf(e.Name) then row.Field(i) */
      }
    }
checkpoint: The evaluator computes literals and column references against a row. Commit and stop here.
---

Running a `WHERE` or a `SELECT` means asking, for each row, "what does this
expression evaluate to *here*?" **Evaluation** answers that. It is a function
over the expression tree, and the leaves are the base cases: a literal evaluates
to itself (independent of the row), and a column reference evaluates by looking
its name up in the schema to get an index, then reading that field from the row.

This is where the schema's name-to-index lookup from lesson 3 finally pays off - it
turns the name `"name"` into position `1` so the evaluator can pull the value out.
A reference to a column that does not exist is an error caught right here. With
the leaves evaluating, adding the interior nodes - comparisons and boolean
operators - is a short step, and that is exactly the predicate a filter needs.
