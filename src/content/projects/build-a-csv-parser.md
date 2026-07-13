---
title: 'Build a CSV Parser'
order: 19
lessons: 27
size: 'Small'
tech: ['RFC 4180', 'Finite-state machines', 'Streaming parsers']
estMin: 20
desc: 'Build a real CSV library from first principles: a finite-state machine that splits a plain comma-and-newline table into records and fields, a quoting state machine that handles embedded delimiters, newlines, and doubled-quote escapes with positioned errors, line-ending and BOM handling, a configurable dialect, a streaming reader that yields one record at a time, a header mode, and a writer that quotes exactly what needs it, proven by round-trip and ending in a normalizer for messy real-world CSV.'
blurb: 'Start with a parser that reads a single field and end with a library that turns messy CSV text into records, streams one record at a time, maps rows to headers, and writes records back out quoting exactly the fields that need it. Every lesson is one concrete spec with exact records, fields, output, and error positions: a quoted field keeps an embedded comma and newline, a doubled quote collapses to one, a lone carriage return inside quotes survives, an unterminated quote errors at its exact line and column, and write-then-parse round-trips.'
overview: |
  Over 27 lessons you build a working CSV library from scratch. It begins as a finite-state machine that walks the input one rune at a time: first splitting a plain comma-and-newline table into records and fields, then growing a quoting state machine so a field wrapped in double quotes can hold the delimiter, a newline, and a doubled-quote escape, with clear errors that name the line and column of an unterminated quote or stray text after a closing quote. From there you handle the real world: carriage-return and CRLF line endings, a lone carriage return preserved inside quotes, significant leading and trailing spaces, and a leading UTF-8 byte-order mark.

  On top of that core you add a configurable dialect (a custom delimiter, optional trimming, comment lines), a streaming reader that yields one record at a time with optional strict field-count checking for ragged rows, and a header mode that maps each row to a name-to-value record. Then you build the other half of the library, a writer that emits records and quotes exactly the fields that need it, proven correct by round-trip equivalence, and finish with a capstone that streams a messy real-world file (quotes, an embedded newline, CRLF, a byte-order mark, a ragged row) into records and writes a normalized file back.

  This is a teaching-grade CSV library built around RFC 4180 and the finite-state-machine design that real parsers use: it parses and writes conforming CSV exactly, handles the common messy variations, and reports malformed input with precise positions. It is honest about its choices, which it states as it goes and collects in the caveats: it works on decoded UTF-8 text, treats a blank line as one empty field, and resolves duplicate header names last-wins. What you finish with is the honest core that production CSV libraries extend with type inference, richer encodings, and larger dialect matrices.
parts:
  - name: 'A table of records and fields'
    count: 3
  - name: 'The quoting state machine'
    count: 6
  - name: 'Line endings, whitespace, and a BOM'
    count: 4
  - name: 'A configurable dialect'
    count: 4
  - name: 'A streaming reader and headers'
    count: 4
  - name: 'The writer and a round-trip capstone'
    count: 6
caveats:
  note: 'The library and CLI are complete for a well-behaved comma or simple-dialect CSV workflow with clear positioned error reporting, but parsing loads the whole input into memory and the csvtool CLI does not yet expose the library dialect options as flags.'
  future:
    - 'Expose the dialect options (custom delimiter, comment character, trim, strict mode) as csvtool flags instead of always using the default comma dialect'
    - 'Replace the whole-input in-memory parse with a truly incremental reader over a byte stream, so genuinely huge files use constant memory'
    - 'Add struct-tag-based marshal and unmarshal helpers for typed records, instead of only string records and name-to-value maps'
    - 'Detect and report invalid UTF-8 with a positioned error, the same way malformed quoting is reported'
    - 'Add a csvgrep-style row filter and a dialect-conversion mode (read semicolon-delimited, write comma-delimited) to the CLI'
resources:
  - title: 'RFC 4180: Common Format and MIME Type for CSV Files'
    author: 'Y. Shafranovich'
    url: 'https://www.rfc-editor.org/rfc/rfc4180'
    note: 'The closest thing CSV has to a grammar: how records, fields, quoting, and the doubled-quote escape are defined, and why CRLF is the canonical line ending. Keep it open beside the quoting and line-ending chapters.'
  - title: 'The csv module: CSV File Reading and Writing'
    author: 'Python documentation'
    url: 'https://docs.python.org/3/library/csv.html'
    note: 'The clearest treatment of dialects: delimiter, quoting rules, trimming, and line terminators as configurable knobs. The Dialect this project builds mirrors its design.'
  - title: 'Falsehoods Programmers Believe About CSVs'
    author: 'Donat Studios'
    url: 'https://donatstudios.com/Falsehoods-Programmers-Believe-About-CSVs'
    note: 'A survey of every way a naive split on commas and newlines is wrong: embedded delimiters, embedded newlines, quotes, encodings, and ragged rows. This is the CSV-is-harder-than-you-think list the project pins down one lesson at a time.'
  - title: 'encoding/csv package documentation'
    author: 'The Go Authors'
    url: 'https://pkg.go.dev/encoding/csv'
    note: 'A production reference implementation of exactly this design: a state-machine reader with positioned errors and field-count checking, plus a writer with minimal quoting. Useful to compare your API against once each chapter lands.'
  - title: 'Model for Tabular Data and Metadata on the Web'
    author: 'W3C CSV on the Web Working Group'
    url: 'https://www.w3.org/TR/tabular-data-model/'
    note: 'The modern attempt to give CSV real semantics: dialects, headers, and typed columns. Read it for where a library like this one goes next, beyond raw string records.'
---
