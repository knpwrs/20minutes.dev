---
project: build-a-csv-parser
lesson: 27
title: 'Capstone: normalizing a messy file'
overview: The final lesson runs the whole library on a genuinely messy real-world file, streaming it into records and writing a clean normalized file back, proving every layer works together.
goal: Stream a messy CSV with a BOM, CRLF, quoted fields, an embedded newline, and a ragged row into records, then write a normalized file.
spec:
  scenario: The full library on a messy document
  status: failing
  lines:
    - kw: Given
      text: 'the input that begins with a UTF-8 byte-order mark, then the CRLF-terminated lines name,note,city and Ada,"loves, code",London and Bo,"multi(newline)line",Paris, then a final ragged line Cy,plain with no terminator'
    - kw: When
      text: 'it is streamed through the reader into records and those records are written back with the default dialect'
    - kw: Then
      text: 'the records are [["name", "note", "city"], ["Ada", "loves, code", "London"], ["Bo", "multi\nline", "Paris"], ["Cy", "plain"]]'
    - kw: And
      text: 'the normalized output is exactly name,note,city\nAda,"loves, code",London\nBo,"multi\nline",Paris\nCy,plain\n, with the byte-order mark stripped, CRLF normalized to a single newline, the embedded comma and newline re-quoted minimally, and the ragged final row preserved'
code:
  lang: go
  source: |
    // 1. records, err := NewReader(input).ReadAll()  // BOM stripped, CRLF handled, quotes decoded
    // 2. out := Write(records)                        // default dialect: '\n', minimal quoting
    // the embedded newline in "multi\nline" is re-quoted; the ragged row survives untouched
checkpoint: Your CSV library reads a messy real-world file and writes a clean normalized one. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real, importable **CSV
library** that survives the files you actually meet. The input here is deliberately
awful, an invisible byte-order mark at the front, Windows CRLF line endings, a field
whose value contains the delimiter, a field whose value contains a newline, and a
final row that is missing a column. Naive splitting would mangle every one of these.
Your state machine strips the mark, treats each CRLF as one record boundary, keeps
the quoted comma and the quoted newline as field content, and hands back the ragged
row as-is because you never asked for strict checking.

Then the writer turns those records into a clean, normalized file: one newline per
record, and minimal quoting that re-wraps exactly the two fields that need it, the one
with the embedded comma and the one with the embedded newline, while everything else
is written bare. From a parser that read a single field you have built the honest core
of a CSV library, the same finite-state-machine design that sits inside the tools you
use every day, minus the type inference and encoding matrices they layer on top. The
finalize pass wraps this in a small command-line tool so you can pretty-print or cut
columns from any file at the shell; the engine underneath is entirely yours.
