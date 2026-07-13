---
project: build-a-csv-parser
lesson: 21
title: Draining the reader
overview: The streaming reader and the whole-file Parse should never disagree, since they run the same engine. Today you add a drain-to-completion helper and prove the two agree on tricky input, the payoff that ties the streaming chapter to everything before it.
goal: Add a read-all helper and show it produces exactly what Parse produces.
spec:
  scenario: Streaming and whole-file parsing agree
  status: failing
  lines:
    - kw: Given
      text: 'the input a,"b\nc"\nd,e, which has a quoted field with an embedded newline'
    - kw: When
      text: 'a reader over it is drained to completion with a read-all helper'
    - kw: Then
      text: 'the result is [["a", "b\nc"], ["d", "e"]], identical to what Parse returns for the same input'
    - kw: And
      text: 'the helper stops cleanly at EOF and returns every record exactly once'
code:
  lang: go
  source: |
    // ReadAll loops Read until the EOF sentinel, collecting records
    func (r *Reader) ReadAll() ([][]string, error) {
      // for { rec, err := r.Read(); if err == io.EOF { break }; ... append }
    }
    // the property to check: NewReader(s).ReadAll() deep-equals Parse(s)
checkpoint: A read-all helper drains the reader and agrees with Parse on tricky input. Commit and stop here.
---

You now have two ways to read a CSV: `Parse`, which returns the whole table at once,
and a `Reader`, which yields one record at a time. They must never disagree, because
they are the same state machine consumed two different ways, and this lesson makes
that guarantee explicit. Add a **read-all** helper that loops the reader to its EOF
sentinel, collecting every record, so a caller who wants everything can get it from
the streaming path too.

This is a payoff lesson: if the earlier chapters built the machine correctly, the
helper needs almost no new logic and the equality with `Parse` simply holds, even on
input with a quoted, multi-line field where the record boundary is not a plain
newline. That agreement is the useful check, so assert it directly rather than
manufacturing extra code. It also completes the reading half of the library: you can
consume CSV in bulk or one row at a time, with or without a header, strictly or
loosely. The next chapter turns the machine around and builds the writer, which you
will hold to the same standard by round-tripping it against this reader.
