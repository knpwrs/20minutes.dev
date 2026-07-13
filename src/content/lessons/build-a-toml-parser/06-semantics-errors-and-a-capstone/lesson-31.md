---
project: build-a-toml-parser
lesson: 31
title: Closed tables and conflicts
overview: 'A couple of semantic rules keep TOML documents unambiguous. Today you enforce that an inline table cannot be extended and that a name cannot be both a table and an array of tables.'
goal: 'Reject extending an inline table and mixing a table with an array of tables.'
spec:
  scenario: Semantic conflicts
  status: failing
  lines:
    - kw: Given
      text: 'documents that violate the closed-table rules'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'point = open-brace x = 1 close-brace then point.y = 2 is an error, because an inline table is closed and cannot be added to'
    - kw: And
      text: 'defining open-bracket a close-bracket and then open-bracket-bracket a close-bracket-bracket (or the reverse) is an error, because a name cannot be both a table and an array of tables'
code:
  lang: go
  source: |
    // mark tables built from an inline '{...}' as closed/final
    //   a later dotted key or header touching one -> error
    // when a header targets an existing name, check its kind:
    //   [a] onto an array-of-tables, or [[a]] onto a plain table -> error
    //   ("a" already defined as a different kind)
checkpoint: 'Inline tables stay closed and kind conflicts are rejected. Commit and stop here.'
---

Two semantic rules keep a TOML document from meaning two things at once. The first:
an **inline table is closed**. Once you write `point = { x = 1 }`, that table is
complete and final - a later `point.y = 2` or `[point]` may not reach in and add to
it. This is the payoff of the strictness from the inline-table lesson: because an
inline table is a self-contained literal, extending it afterward is forbidden, and
the parser rejects the attempt.

The second: a name has **one kind**. If `[a]` defines `a` as a table, then
`[[a]]` cannot later treat `a` as an array of tables, and the reverse is equally
wrong. Each targets a different data shape at the same key, so the second one
contradicts the first and is an error. Enforcing both rules is a matter of recording
a little more about each table - whether it came from an inline literal, and whether
it is a plain table or an array of tables - and checking that record before a later
statement modifies it. With these guards, the parser accepts the documents TOML
allows and firmly rejects the ambiguous ones.
