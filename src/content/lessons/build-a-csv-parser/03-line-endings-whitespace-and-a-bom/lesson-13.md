---
project: build-a-csv-parser
lesson: 13
title: A leading byte-order mark
overview: Files exported by spreadsheet tools often begin with an invisible byte-order mark, and if you do not strip it the first field carries a garbage character. Today you skip a leading BOM so the first cell parses cleanly.
goal: Strip a UTF-8 byte-order mark when it is the first character of the input.
spec:
  scenario: A byte-order mark at the start
  status: failing
  lines:
    - kw: Given
      text: 'the input that begins with a UTF-8 byte-order mark (code point U+FEFF) followed by a,b'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the mark is stripped and the first field is exactly "a", giving [["a", "b"]]'
    - kw: And
      text: 'a byte-order mark that is not at the very start is kept as a literal character, so a,(U+FEFF)b parses to ["a", "(U+FEFF)b"]'
code:
  lang: go
  source: |
    // the UTF-8 BOM is the single rune U+FEFF (bytes EF BB BF) if present
    // before the state machine runs, if the FIRST rune is U+FEFF, skip it:
    //   input = strings.TrimPrefix(input, "\uFEFF")  // a Unicode escape, never the raw glyph
    // do NOT strip it anywhere else; mid-input it is ordinary content
checkpoint: A leading byte-order mark is stripped so the first field is clean. Commit and stop here.
---

A **byte-order mark**, code point `U+FEFF`, is an invisible character that some
editors and spreadsheet exporters place at the very start of a UTF-8 file. It carries
no textual meaning there, but if your parser does not remove it, it becomes part of
the first field, so a header that should read `name` reads as an unprintable
character followed by `name` and every lookup by that column name fails. This is one
of the most common real-world CSV gotchas, and the fix is a single check.

Handle it as a preprocessing step before the state machine sees the input: if the
first character is `U+FEFF`, drop it, and otherwise leave the input alone. The rule
is strictly positional, only a mark at the absolute start is a BOM, because anywhere
else the same code point could be legitimate content, so a mark in the middle of the
data stays put. Because your parser works on decoded text, you are stripping one rune
rather than three bytes, but the intent is the same. With this in place the parser
tolerates the files real tools produce, which rounds out the messy-input chapter and
sets up the configurable dialect next.
