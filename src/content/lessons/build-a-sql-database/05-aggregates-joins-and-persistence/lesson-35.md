---
project: build-a-sql-database
lesson: 35
title: Qualified column names
overview: Joining two tables means two columns can share a name, so you need to say which table you mean. Today you parse and resolve qualified names like users.id.
goal: Parse a table-qualified column reference and resolve it against a schema whose columns carry table names.
spec:
  scenario: Resolving a qualified column reference
  status: failing
  lines:
    - kw: Given
      text: 'a schema whose columns are users.id, users.name, orders.total'
    - kw: When
      text: 'the qualified reference "users.name" is evaluated against a row'
    - kw: Then
      text: it resolves to that row's users.name field
    - kw: And
      text: 'an ambiguous bare "id" that matches more than one table reports an error'
code:
  lang: go
  source: |
    // tokenizer/parser: an identifier, optional '.' identifier -> ColRef{Table,Name}
    // schema columns gain an optional Table qualifier
    // IndexOf: match on (table,name) when qualified; on name alone when not,
    //   erroring if a bare name matches columns from more than one table
checkpoint: The engine understands table-qualified column names and flags ambiguous ones. Commit and stop here.
---

Once a query touches two tables, a column name like `id` may be ambiguous - both
`users` and `orders` might have one. **Qualified names** - `users.id` - remove the
doubt by naming the table. This touches three layers: the parser reads an optional
`.` and second identifier into a `ColRef` that carries a table plus a column,
schema columns gain an optional table qualifier, and lookup matches on the pair
when qualified.

A bare, unqualified name still works when it is unambiguous, but must raise an
error when it matches columns in more than one table - guessing would silently
return the wrong data. Building this now, against a single table whose schema
carries qualifiers, means the join tomorrow can express `ON users.id =
orders.user_id` and resolve both sides correctly. It is the last piece the join
needs.
