---
project: build-a-toml-parser
lesson: 20
title: Table headers
overview: 'A flat list of pairs is not enough for real config; you need grouping. Today you parse a table header, a name in square brackets, which starts a new subtable that following pairs belong to.'
goal: 'Parse a [name] header so that following pairs go into that subtable.'
spec:
  scenario: A single table header
  status: failing
  lines:
    - kw: Given
      text: 'the document with a line reading open-bracket server close-bracket, then port = 80, then host = "local"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'the root table has one entry server, itself a table with entries port (integer 80) then host (string local)'
    - kw: And
      text: 'pairs written before any header stay at the root, and a header changes where the following pairs are stored'
code:
  lang: go
  source: |
    // keep a `current *Table` pointer, starting at the root
    // a line matching [ key ] is a table header:
    //   make a new child Table under the root at that key
    //   set current = that child
    // a key/value pair is appended to `current`, not always the root
checkpoint: 'A [name] header routes following pairs into a subtable. Commit and stop here.'
---

Configuration is naturally grouped - server settings here, database settings there
- and TOML expresses grouping with a **table header**: a name in square brackets on
its own line, like `[server]`. Everything after that header, up to the next header
or the end of the file, belongs to that table. So `[server]` followed by `port = 80`
puts `port` inside `server`, not at the top level.

The mechanism is a **current-table pointer**. It starts at the root, and every
key/value pair is appended to whatever table it currently points at. A header does
one thing: create the named subtable under the root and move the pointer to it.
Pairs written before any header stay at the root, since that is where the pointer
begins. This single piece of state - "which table are we filling?" - is what turns a
flat parser into one that builds a shallow tree, and the next lessons deepen it with
dotted names.
