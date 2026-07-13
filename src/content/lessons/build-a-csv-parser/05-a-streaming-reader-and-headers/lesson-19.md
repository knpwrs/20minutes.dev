---
project: build-a-csv-parser
lesson: 19
title: Strict field counts
overview: A table usually wants every row to have the same number of columns, and a row that does not is often a real data error. Today you add an optional strict mode that catches a ragged row and reports which line broke the shape.
goal: In strict mode, error when a record's field count differs from the first record's, naming the line and counts.
spec:
  scenario: A ragged row under strict checking
  status: failing
  lines:
    - kw: Given
      text: 'a reader in strict mode over the input "a,b\nc,d,e", where the second record has three fields but the first has two'
    - kw: When
      text: 'records are read in order'
    - kw: Then
      text: 'the first read returns ["a", "b"], and the second read fails with an error naming line 2, a got count of 3, and a want count of 2'
    - kw: And
      text: 'without strict mode the same input reads both records as-is, so the second record is ["c", "d", "e"]'
code:
  lang: go
  source: |
    // add a Strict bool to the reader and a FieldCountError:
    type FieldCountError struct { Line, Got, Want int }
    // on the FIRST record, remember its length as the expected count
    // on each later record when Strict: if len(record) != expected -> return the error
    // when not Strict: return every record unchanged (ragged rows are allowed)
checkpoint: Strict mode rejects a ragged row with its line and field counts; the default allows ragged rows. Commit and stop here.
---

CSV is a table format, and most of the time a well-formed table has the same number
of fields in every record. A row with the wrong count usually means something went
wrong upstream, an unescaped delimiter, a truncated export, a merged cell, and
catching it early beats letting a downstream lookup read the wrong column. So the
reader gains an optional **strict** mode: the first record it reads establishes the
expected field count, and any later record that differs is reported as an error.

Make the error specific, because a ragged-row complaint is only useful if it tells
you where to look. Name the **line** of the offending record and both counts, what it
got and what it wanted, so the message points straight at the bad row. Keep this
opt-in: the default stays permissive and returns ragged rows exactly as they are,
because plenty of real CSV is legitimately jagged and a library that refused it would
be unusable. This is the same design the field-count checking in mature CSV libraries
uses, one remembered number and a per-record comparison.
