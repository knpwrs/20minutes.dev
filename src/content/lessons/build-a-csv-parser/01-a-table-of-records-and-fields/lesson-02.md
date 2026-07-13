---
project: build-a-csv-parser
lesson: 2
title: Splitting a record into fields
overview: The comma is what puts the C in CSV. Today you teach the parser to break one record into its fields on the delimiter, building each field character by character and flushing it when a comma arrives, the core loop every later feature hangs on.
goal: Split a single record into its comma-separated fields, including empty ones.
spec:
  scenario: Fields separated by the comma delimiter
  status: failing
  lines:
    - kw: Given
      text: 'the input "a,b,c"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the one record has three fields, ["a", "b", "c"]'
    - kw: And
      text: 'parsing "a,,c" gives a middle empty field, ["a", "", "c"], and parsing "a,b," (a trailing comma) gives three fields with an empty last one, ["a", "b", ""]'
code:
  lang: go
  source: |
    // build the current field in a buffer; a comma flushes it and starts the next
    var field []rune
    var record []string
    for _, r := range input {
      if r == ',' {
        record = append(record, string(field)) // flush, field may be empty
        field = field[:0]
      } else {
        field = append(field, r)
      }
    }
    record = append(record, string(field)) // the last field after the final comma
checkpoint: The parser splits a record into its comma-separated fields, empty fields included. Commit and stop here.
---

A record is not an opaque string; it is a sequence of fields joined by the
**delimiter**, which for standard CSV is the comma. To pull the fields apart, walk
the record one character at a time and accumulate a **field buffer**. Each time you
hit a comma you have reached the end of a field, so you push whatever is in the
buffer, even if it is empty, and start a fresh field. When the record ends you push
the buffer one last time. That final flush is why `"a,b,c"` yields three fields and
not two: the comma is a separator between fields, not a terminator after each one.

The empty cases are the ones people get wrong, so pin them now. Two commas in a row,
`"a,,c"`, means the middle field is the empty string, giving three fields. A record
that ends in a comma, `"a,b,"`, means the field after that last comma is empty too,
giving three fields whose last one is `""`. A comma always separates N commas into
N plus one fields, so counting the fields is the same as counting the commas and
adding one. Resist the urge to reach for a library split routine: building the field
buffer by hand is the exact loop the quoting state machine will grow out of.
