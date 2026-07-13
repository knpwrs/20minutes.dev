---
project: build-a-toml-parser
lesson: 32
title: 'Capstone: a real configuration'
overview: 'The final lesson runs the whole library on a realistic multi-section config that uses every feature, parsing it into one exact nested document and proving every layer works together.'
goal: 'Parse a full configuration with every value type into the exact nested tree.'
spec:
  scenario: The full library on a real config
  status: failing
  lines:
    - kw: Given
      text: 'a configuration with a top-level title = "TOML Demo" and enabled = true, an [owner] table with a dob of 1979-05-27T07:32:00Z, a [database] table with port = 8080, ports = an array of 8000 8001 8002, ratio = 3.14, and mask = 0xDEAD, a [servers.alpha] table, two [[products]] elements, and a [notes] table with a multiline basic string'
    - kw: When
      text: 'the document is parsed'
    - kw: Then
      text: 'title is the string TOML Demo, enabled is true, owner.dob is an offset date-time at zero offset, database.port is 8080, database.mask is the integer 57005, database.ratio is 3.14, and database.ports is an array of three integers'
    - kw: And
      text: 'products is an array of two tables where products index 0 name is Hammer and products index 1 has an inline table color with finish "matte", servers.alpha is a nested table, and notes.text is exactly line one, newline, line two, newline'
code:
  lang: go
  source: |
    // doc, err := Parse(source)   // the whole multi-section config; err is nil
    // v, _ := doc.Get("database"); db := v.Tbl
    // db.Get("mask")   -> KindInteger 57005   (0xDEAD)
    // p, _ := doc.Get("products"); p.Arr[1].Tbl.Get("color") -> inline table
    // n := notes.Get("text")      -> "line one\nline two\n"
checkpoint: 'Your TOML library parses a real configuration into an exact nested document. The project is complete - commit and stop here.'
---

This is the promise the whole project was built to keep: a real, importable **TOML
library**. Give it a configuration that uses everything - a top-level `title` and
`enabled`, an `[owner]` table with a datetime, a `[database]` table with an integer,
a hex integer, a float, and an array, a nested `[servers.alpha]` header, two
`[[products]]` elements one of which holds an inline table, and a `[notes]` table
with a multiline basic string - and it parses the text into one nested tree of typed
values. Every value form, every table shape, and the current-table machinery all
run at once.

The line reader skipped comments and blanks, the value dispatch told strings from
numbers from dates, the string readers applied their trims and escapes, and the
header and dotted-key logic assembled the nested document while catching any
duplicate or conflict. From a parser that read one `key = value` line into a flat
table you have built the honest core of a TOML library - the same design that sits
inside the configuration loaders you use every day, minus the serializer and the
rarest conformance corners. The finalize pass wraps this in a small command that
pretty-prints any config from the shell; the engine underneath is entirely yours.
