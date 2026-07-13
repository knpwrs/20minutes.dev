---
project: build-a-csv-parser
lesson: 18
title: A reader that yields one record
overview: Many callers want to consume a CSV one row at a time rather than as a whole table. Today you wrap the state machine in a reader that hands back one record per call and signals the end of input, the cursor-style interface that a program iterates over row by row.
goal: Build a reader that returns records one at a time and signals the end of input.
spec:
  scenario: Reading records one by one
  status: failing
  lines:
    - kw: Given
      text: 'a reader over the input "a,b\nc,d"'
    - kw: When
      text: 'its next-record method is called repeatedly'
    - kw: Then
      text: 'the first call returns ["a", "b"], the second returns ["c", "d"], and the third signals end of input (an EOF sentinel, not a record)'
    - kw: And
      text: 'the records match what Parse would produce, including a quoted field with an embedded comma or newline'
code:
  lang: go
  source: |
    // hold the parsed records and a cursor; hand back the next one each call
    type Reader struct { /* records + position */ }
    func NewReader(input string) *Reader { /* ... */ }
    // Read returns the next record, or nil + an EOF sentinel when exhausted
    func (r *Reader) Read() ([]string, error) { /* return nil, io.EOF at the end */ }
checkpoint: A reader yields records one at a time and signals EOF when the input is exhausted. Commit and stop here.
---

Up to now your parser has returned the whole table at once. Many callers would rather
pull one record at a time, process it, and move on, the way you iterate a database
cursor or a line scanner. So you give the library a **reader**: an object that
produces one record each time you ask and reports an end-of-input **sentinel** when
there are no more, conventionally the same signal your language uses for reading
files. This one-record-at-a-time interface is what the header and strict-checking
modes in the next lessons hang off, and it reads much more naturally than indexing
into a slice.

For now the reader runs the existing parser once and hands out the resulting records
in order, so it yields exactly what `Parse` would, quoted and multi-line fields
included, just delivered one at a time. That keeps this lesson small and the behavior
provably identical to the whole-file path. A truly **incremental** reader, one that
parses straight off a byte stream and never holds the whole input in memory, is the
natural next step for genuinely huge files and a good extension once the interface is
in place; the cursor shape you build today is exactly what that version would present.
