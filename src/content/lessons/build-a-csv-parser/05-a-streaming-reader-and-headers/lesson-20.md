---
project: build-a-csv-parser
lesson: 20
title: Mapping rows to a header
overview: Most CSV files put column names in the first row, and consumers want each later row as a name-to-value record rather than a bare list. Today you add a header mode that reads that first row and maps every following record to it.
goal: Treat the first record as a header and map each subsequent record to a name-to-value map.
spec:
  scenario: Reading records as header-keyed maps
  status: failing
  lines:
    - kw: Given
      text: 'a reader in header mode over the input "name,age\nAda,36"'
    - kw: When
      text: 'the first data record is read as a map'
    - kw: Then
      text: 'the result is the map {"name": "Ada", "age": "36"}, having consumed the first row as the header'
    - kw: And
      text: 'a short data row fills missing columns with the empty string, so under header name,age the row "Ada" maps to {"name": "Ada", "age": ""}; a duplicate header name keeps the last value, so header a,a with row 1,2 maps to {"a": "2"}; and a row longer than the header drops the extra values, so header a,b with row 1,2,3 maps to {"a": "1", "b": "2"}'
code:
  lang: go
  source: |
    // on first use, read one record and keep it as the header names
    // ReadMap reads the next record and zips header[i] -> record[i]
    //   fewer values than headers -> missing keys map to ""
    //   more values than headers  -> extra values are dropped
    //   a repeated header name     -> later value overwrites (last-wins, natural for a map)
checkpoint: In header mode the reader maps each row to a name-to-value record. Commit and stop here.
---

The first row of a CSV file is very often a header naming the columns, and a caller
who has that header would much rather work with `row["age"]` than `row[1]`. So the
reader gains a **header mode**: the first record it reads is taken as the column
names, and every record after it is zipped against those names into a map. This turns
positional data into keyed data and is how most real programs actually consume CSV.

Two edges decide the behavior and are worth pinning. A data row **shorter** than the
header is common in exports that omit trailing empty cells, so a missing column maps
to the empty string rather than being absent, keeping every row's key set uniform. A
**duplicate** header name, which real files do contain, resolves last-wins, because a
map keyed by name can only hold one value per key and the natural result of writing
each column in order is that the later one survives. A row **longer** than the header
has no name for its extra values, so those are dropped. State these rules and the
header mode is predictable even on the imperfect files it exists to handle.
