---
title: 'Build a TOML Parser'
order: 48
lessons: 32
size: 'Small'
tech: ['TOML', 'Recursive descent', 'Configuration formats']
estMin: 20
desc: 'Parse TOML into a nested document: strings, numbers, datetimes, tables, and arrays of tables.'
blurb: 'Start with a parser that reads one key = value line into a flat table and end with a library that turns a whole TOML document into a nested tree of typed values: strings, integers, floats, booleans, datetimes, arrays, and tables. Every lesson is one concrete spec with exact parsed values, structure, and error positions: a \uXXXX escape decodes to its character, a literal string keeps its backslashes, a trailing backslash trims the newline in a multiline string, 1_000 becomes 1000 and 0xDEAD becomes 57005, an offset datetime is told apart from a local date, [a.b] builds nested tables, a dotted key builds its intermediates, [[products]] appended twice gives a two-element array, and a duplicate key fails at its exact position.'
overview: |
  Over 32 lessons you build a working TOML library from scratch: a line reader that turns key = value pairs and # comments into a flat table; every TOML string flavor (basic strings with all their escapes including \uXXXX and \UXXXXXXXX, literal strings that keep their backslashes, and both multiline forms with the leading-newline trim and the line-ending backslash trim); the full scalar grammar (signed integers with _ separators and 0x, 0o, 0b bases; floats with fractions, exponents, and inf and nan; booleans; and RFC 3339 offset date-times, local date-times, local dates, and local times); table headers [a.b.c] and dotted keys that build a nested document tree; inline arrays, inline tables, and arrays of tables that append an element each occurrence; and error reporting that names the exact line and column of a duplicate key, a redefined table, an unterminated string, or a bad escape.

  By the end you have an importable library whose public API parses TOML text into a nested tree of typed values, told apart by kind, and reports malformed input with a precise position. The finalize pass wraps it in a small runnable demo that parses a built-in configuration string or a .toml file and pretty-prints the resulting structure, printing a clear line-and-column error when the input is invalid.

  This is a teaching-grade TOML 1.0 parser built around the real toml.io grammar and a recursive-descent design: it parses the value types, tables, dotted keys, arrays, inline tables, and arrays of tables that make up ordinary configuration files, and it is honest about its limits - it targets valid UTF-8 input, keeps insertion order, and stops short of a serializer and of the rarer conformance corners the official test suite probes. What you finish with is the honest core that production TOML libraries extend with encoding, richer datetime handling, and exhaustive spec coverage.
parts:
  - name: 'Keys, values, and a flat table'
    count: 5
  - name: 'String values'
    count: 7
  - name: 'Numbers, booleans, and dates'
    count: 7
  - name: 'Tables and dotted keys'
    count: 5
  - name: 'Arrays and inline tables'
    count: 5
  - name: 'Semantics, errors, and a capstone'
    count: 3
caveats:
  note: 'A teaching-grade TOML 1.0 parser: a recursive-descent library that turns TOML text into a nested tree of typed values (all four string flavors, numbers with 0x/0o/0b bases and inf/nan, RFC 3339 datetimes, tables, dotted keys, arrays, inline tables, and arrays of tables) with positioned line-and-column errors, plus a runnable tomldump command that pretty-prints a config or fails gracefully on invalid input. It is honest about its limits: it only parses (there is no encoder), stores datetimes as unvalidated component fields rather than real time values, caps integers at 64 bits, and does not chase every toml-test conformance corner.'
  future:
    - 'Add an encoder that emits canonical TOML text, so a parsed document can round-trip back to a file'
    - 'Expose datetimes as real time values with calendar range validation, alongside the raw component fields the parser records now'
    - 'Run the official toml-test compliance suite and close the gaps it reveals, both valid documents that should parse and invalid ones that should be rejected'
    - 'Support arbitrary-precision and big integers so very large IDs do not overflow the 64-bit range'
    - 'Tighten string validation to reject disallowed control characters and validate the surrogate ranges of \uXXXX escapes'
    - 'Add a decode-into-struct convenience that maps a document onto Go-style struct fields, the way production TOML libraries expose their data'
resources:
  - title: 'TOML v1.0.0 specification'
    author: 'Tom Preston-Werner et al.'
    url: 'https://toml.io/en/v1.0.0'
    note: 'The canonical grammar this project parses: keys, the string flavors, the number and datetime forms, tables, dotted keys, arrays, inline tables, and arrays of tables. Keep it open beside every lesson.'
  - title: 'A TOML-compatible ABNF grammar'
    author: 'TOML maintainers'
    url: 'https://github.com/toml-lang/toml/blob/main/toml.abnf'
    note: 'The formal grammar that pins the exact character classes for bare keys, the boundaries of each value, and the multiline trim rules the string lessons implement.'
  - title: 'toml-test: a language-agnostic TOML compliance suite'
    author: 'Caleb Meredith, Martin Tournoij'
    url: 'https://github.com/toml-lang/toml-test'
    note: 'Hundreds of valid and invalid documents with their expected parse results. The edge cases the error and semantics chapters pin are drawn from the same corners this suite probes.'
  - title: 'RFC 3339: Date and Time on the Internet: Timestamps'
    author: 'G. Klyne, C. Newman'
    url: 'https://www.rfc-editor.org/rfc/rfc3339'
    note: 'The timestamp grammar behind TOML datetimes: the offset date-time, and the local date, time, and date-time forms the datetime lessons tell apart.'
  - title: 'Crafting Interpreters'
    author: 'Robert Nystrom'
    url: 'https://craftinginterpreters.com/scanning.html'
    note: 'The scanning and recursive-descent chapters explain the reader-and-parser structure this project mirrors: consume one meaningful piece at a time, then descend through the grammar to build a tree.'
---
