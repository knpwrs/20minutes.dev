---
project: build-a-csv-parser
lesson: 26
title: Writing maps with a header
overview: Just as the reader maps rows to a header, the writer should turn name-to-value records back into rows under a header. Today you add that, the write-side mirror of header mode, so keyed data becomes a proper CSV with a header row.
goal: Write a header row and then each map's values in header order, filling missing keys with the empty string.
spec:
  scenario: Writing header-keyed records
  status: failing
  lines:
    - kw: Given
      text: 'the header ["name", "age"] and the rows [{"name": "Ada", "age": "36"}, {"name": "Bo"}]'
    - kw: When
      text: 'they are written with a header'
    - kw: Then
      text: 'the output is "name,age\nAda,36\nBo,\n", writing the header first, then each row in header order'
    - kw: And
      text: 'a key missing from a row is written as an empty field, so Bo has an empty age, and values are quoted by the same rules as any field'
code:
  lang: go
  source: |
    // WriteMaps(headers []string, rows []map[string]string) string:
    //   first record is the headers themselves
    //   for each row, emit headers[i] -> row[headers[i]] (missing key -> "")
    // build a [][]string and reuse Write, so quoting and terminators come for free
checkpoint: The writer emits header-keyed maps as a CSV with a header row and empty fields for missing keys. Commit and stop here.
---

Header mode made reading produce name-to-value maps, and a symmetric writer completes
the pattern by consuming them. You give it the column order as an explicit header, because
a map has no inherent order and the columns must line up the same way in every row, then
it writes the header as the first record and each subsequent row by looking up each
header name in that row's map. The result is a well-formed CSV whose first line names
the columns, which is what most consumers expect.

The one rule to fix is what happens when a row is **missing** a key the header names:
it is written as an empty field, so every output row has the same number of columns as
the header regardless of which keys each map happened to contain. This mirrors the
reader's short-row rule and keeps the table rectangular. Build the header and rows into
a plain list of records and hand them to the writer you already have, so all the quoting,
escaping, and terminator logic is reused unchanged. That reuse is the sign the library's
pieces compose cleanly, which the capstone is about to lean on completely.
