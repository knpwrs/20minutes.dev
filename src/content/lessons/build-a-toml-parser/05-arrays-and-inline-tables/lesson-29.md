---
project: build-a-toml-parser
lesson: 29
title: Subtables within array elements
overview: 'An array-of-tables element is a full table, so it can contain subtables. Today you make a following header nest into the most recent element of an array of tables.'
goal: 'Resolve a [name.sub] header into the last element of an array of tables.'
spec:
  scenario: A subtable under an array element
  status: failing
  lines:
    - kw: Given
      text: 'open-bracket-bracket fruit close-bracket-bracket, name = "apple", open-bracket fruit.physical close-bracket, color = "red", then open-bracket-bracket fruit close-bracket-bracket, name = "banana"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'fruit is an array of two tables: the first has name "apple" and a subtable physical with color "red", the second has name "banana"'
    - kw: And
      text: 'a header path that passes through an array of tables descends into that array''s last element'
code:
  lang: go
  source: |
    // when walking a header's segments and a segment names an
    // array-of-tables, descend into its LAST element (not a new one)
    // so [fruit.physical] finds array `fruit`, takes its last table,
    //   and creates/enters `physical` there
    // [[fruit]] again appends a fresh element and moves current to it
checkpoint: 'Headers nest into the latest element of an array of tables. Commit and stop here.'
---

Because each element of an array of tables is a **full table**, it can hold
subtables like any other. TOML addresses them by letting a later header **path
through** the array: after `[[fruit]]`, a header `[fruit.physical]` means "the
`physical` table inside the current (most recent) `fruit` element." So a fruit can
have a name and a nested `physical` block, and the next `[[fruit]]` starts a clean
new element.

The rule that makes this work is how header resolution treats an array segment:
when walking the dotted path and a segment names an **array of tables**, descend into
its **last element** rather than creating a new one. Only a `[[...]]` header appends;
a `[...]` header that passes through an array just visits the latest record. With
this, the current-table machinery handles the last real-world shape - lists of
records, each with their own nested structure - and the parser can build essentially
any TOML document. The capstone will lean on exactly this.
