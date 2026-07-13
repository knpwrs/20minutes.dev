---
project: build-a-protobuf-decoder
lesson: 16
title: Repeated fields into a map
overview: The same field number can appear many times in a message, which is how repeated fields are stored. Today you group the flat field list by number so each field maps to the list of values seen for it.
goal: Group the parsed field list into a map from field number to the list of its values.
spec:
  scenario: Repeated field numbers collect into a list
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0x08, 0x03, 0x08, 0x05, 0x10, 0x09 (field 1 twice, then field 2 once)'
    - kw: When
      text: 'the fields are grouped by number'
    - kw: Then
      text: 'field 1 maps to the list of values 3 and 5, in that order'
    - kw: And
      text: 'field 2 maps to the single value 9, and a field number that never appears is absent from the map'
code:
  lang: go
  source: |
    // append each field's value under its number, preserving order
    func GroupByNumber(fields []Field) map[int][]Field {
      out := map[int][]Field{}
      for _, f := range fields {
        out[f.Number] = append(out[f.Number], f)
      }
      return out
    }
checkpoint: You can group repeated fields by their number. Commit and stop here.
---

Protobuf has no dedicated "array" on the wire. A **repeated** field is simply the
same field number written more than once, each occurrence a full tag-and-value.
Grouping the flat field list into a map from number to a list of occurrences turns
that wire reality into something usable: a field that appears three times has three
entries, a field that appears once has one, and a field that never appears is
missing entirely.

Preserving order within each number's list matters. For a genuinely repeated field
the order is the array order the sender intended. For a non-repeated (scalar) field
that mistakenly appears twice, protobuf says the **last** one wins - and you can
only honor that if you kept them in order. This grouping is deliberately dumb: it
does not yet know which fields are meant to be repeated. That judgment needs a
schema, which arrives in the final chapter; here you just organize the raw truth.
