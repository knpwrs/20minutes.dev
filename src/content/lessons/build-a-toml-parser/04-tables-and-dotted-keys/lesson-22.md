---
project: build-a-toml-parser
lesson: 22
title: Dotted keys
overview: 'Nesting can also happen on the left of a single pair. Today you parse a dotted key, which builds intermediate tables within the current table without a header.'
goal: 'Parse a dotted key like a.b.c = 1, creating the intermediate tables.'
spec:
  scenario: A dotted key on one line
  status: failing
  lines:
    - kw: Given
      text: 'the single line a.b.c = 1'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'the root has a table a, containing a table b, containing c with the integer 1'
    - kw: And
      text: 'dotted keys are relative to the current table, so under a header open-bracket server close-bracket the line auth.enabled = true puts enabled inside server.auth'
code:
  lang: go
  source: |
    // parse the key text into dotted segments (reuse the header splitter)
    // the LAST segment is the real key; the earlier ones are tables
    // walk/create intermediate tables starting from `current`
    // set the final key in the deepest table to the parsed value
checkpoint: 'Dotted keys build their intermediate tables inline. Commit and stop here.'
---

The same dotted nesting that headers use also works on the **left of a single
pair**. Writing `a.b.c = 1` builds table `a`, table `b` inside it, and sets key `c`
to `1` inside that - all on one line, without a header. This is convenient for a
one-off nested value, or for grouping a couple of related settings without opening a
whole table section.

Parsing reuses the header's dotted-key splitter, then treats the pieces asymmetrically:
the **last segment is the actual key** that gets the value, and every earlier segment
names an intermediate table to walk or create. The crucial detail is the starting
point: dotted keys are **relative to the current table**, not the root. So under a
`[server]` header, `auth.enabled = true` creates `auth` inside `server` and sets
`enabled` there, landing at `server.auth.enabled`. Header context and dotted keys
compose, and together they can express any nested shape a document needs.
