---
project: build-a-csv-parser
lesson: 3
title: Splitting the input into records
overview: A file has many rows, and the newline is what divides them. Today you extend the loop so a newline flushes the current record and starts the next, and you pin down the tricky boundary cases, a trailing newline, a missing final newline, and a blank line, that decide how many records you get.
goal: Split multi-line input into records on the newline, handling the trailing-newline and blank-line boundaries.
spec:
  scenario: Records separated by the newline
  status: failing
  lines:
    - kw: Given
      text: 'the input "a,b\nc,d" (two lines joined by a newline)'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the result is two records, [["a", "b"], ["c", "d"]]'
    - kw: And
      text: 'a trailing newline adds no empty record, so "a,b\n" and "a,b" both parse to [["a", "b"]], while a blank line is one empty field, so "a\n\nb" parses to [["a"], [""], ["b"]]'
code:
  lang: go
  source: |
    // a newline flushes the field AND the record; EOF flushes only if content is pending
    if r == '\n' {
      record = append(record, string(field)); field = field[:0]
      out = append(out, record); record = nil
      continue
    }
    // after the loop: flush a trailing field/record only when buffer or record is non-empty
    // (so a bare trailing newline does not manufacture an empty record)
checkpoint: The parser turns multi-line text into a table of records, with the newline boundaries pinned down. Commit and stop here.
---

The newline plays the same role between records that the comma plays between
fields: it ends the current field and, additionally, ends the current record. So a
newline does two flushes at once, push the field buffer as the last field of this
record, then push the record onto the output and start an empty one. With that, a
two-line input becomes two records and the table finally has more than one row.

The interesting part is the boundaries, and they are where naive parsers disagree.
A file that ends with a newline should **not** yield a phantom empty record after
it, so `"a,b\n"` and `"a,b"` must parse to the same single record. The rule that
gets this right is: a newline always flushes a record, but at the very end of input
you flush a final record only if something is pending, a non-empty field buffer or a
record that already has fields in it. A **blank line**, though, does carry meaning:
`"a\n\nb"` has an empty line in the middle, and that empty line is a record with one
empty field, `[""]`. This is a deliberate choice, a blank line is one empty field
rather than being skipped, and it is worth stating because other tools skip blank
lines instead. Pin all three cases now and they will not surprise you when quoting
and carriage returns complicate the picture.
