---
project: build-a-csv-parser
lesson: 25
title: Writing with a dialect
overview: The writer should speak the same dialects the reader does, so it can emit tab- or semicolon-separated files. Today you thread the dialect through the writer, so its delimiter and its quoting decision stay in sync.
goal: Write with a configurable delimiter, quoting fields that contain that delimiter rather than the comma.
spec:
  scenario: Writing a semicolon dialect
  status: failing
  lines:
    - kw: Given
      text: 'a dialect whose delimiter is a semicolon, and the record ["a,b", "c;d"]'
    - kw: When
      text: 'it is written with that dialect'
    - kw: Then
      text: 'the output is a,b;"c;d" followed by a newline, so the comma field is written bare and the semicolon field is quoted'
    - kw: And
      text: 'writing then parsing with the same dialect round-trips, so parsing the output with the semicolon dialect returns [["a,b", "c;d"]]'
code:
  lang: go
  source: |
    // WriteWith(d Dialect, records) joins with d.Delimiter and terminates with '\n'
    // the quote trigger now uses the dialect delimiter, not a hard-coded comma:
    //   quote if the field contains d.Delimiter, a '"', a '\r', or a '\n'
    // Write(records) is WriteWith(DefaultDialect, records)
checkpoint: The writer honors the dialect delimiter and quotes accordingly, round-tripping with the matching reader. Commit and stop here.
---

A writer that only ever emits commas cannot produce the tab- and semicolon-separated
files the reader happily consumes, so the writer takes a dialect too. The delimiter it
joins with becomes the dialect's delimiter, and, just as importantly, so does the
delimiter it checks for when deciding whether to quote. Under a semicolon dialect a
comma is ordinary content that needs no quoting, while a semicolon is the character
that would break a field and so must be quoted. The quote trigger and the join
character must come from the same dialect, or the writer would quote the wrong things.

This keeps the two halves of the library symmetric: whatever dialect you write with,
reading the result with the **same** dialect returns the original records. That
symmetry is the practical meaning of a dialect, one description of a file format that
both directions obey. Redefine the plain `Write` as `WriteWith` using the default
comma dialect, exactly as you did for `Parse` and `ParseWith`, so all your earlier
writer behavior is preserved while the configurable path opens up. With this, the
library can convert between dialects, read semicolons and write tabs, purely by
pairing a reader dialect with a writer dialect.
