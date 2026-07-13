---
project: build-a-csv-parser
lesson: 14
title: A configurable delimiter
overview: Not every "CSV" file uses commas; tab- and semicolon-separated files are everywhere. Today you introduce a dialect that carries the delimiter, so the same state machine can parse any single-character separator.
goal: Parse with a configurable delimiter by threading a dialect through the parser.
spec:
  scenario: A semicolon or tab delimiter
  status: failing
  lines:
    - kw: Given
      text: 'a dialect whose delimiter is a semicolon, and the input a;b;c'
    - kw: When
      text: 'it is parsed with that dialect'
    - kw: Then
      text: 'the record has three fields, ["a", "b", "c"]'
    - kw: And
      text: 'with a semicolon delimiter a comma is an ordinary character, so a,b parses to one field "a,b", and the default Parse still uses the comma'
code:
  lang: go
  source: |
    // introduce the dialect now, with room for the options coming next
    type Dialect struct { Delimiter rune /* Trim, Comment added later */ }
    var DefaultDialect = Dialect{Delimiter: ','}
    func ParseWith(d Dialect, input string) ([][]string, error) { /* the state machine */ }
    func Parse(input string) ([][]string, error) { return ParseWith(DefaultDialect, input) }
    // everywhere the code compared a rune to ',' now compares to d.Delimiter
checkpoint: The parser reads its delimiter from a dialect; Parse is the comma default of ParseWith. Commit and stop here.
---

The C in CSV says comma, but the format is used with every separator under the sun:
tabs for TSV, semicolons in locales where the comma is a decimal point, pipes in log
exports. Rather than hard-code the comma, you introduce a **dialect**, a small
configuration value that describes how a particular family of files is punctuated.
Today it holds just the delimiter, but you give it a struct of its own because the
next lessons add trimming and comment characters, and threading one dialect value
through the parser now is far cleaner than adding parameters one at a time later.

The refactor is mechanical: every place the state machine compared a rune to the
literal comma now compares it to the dialect's delimiter. Introduce a `ParseWith`
that takes a dialect, and redefine the original `Parse` as `ParseWith` with a default
comma dialect, so all your earlier behavior and tests are preserved exactly. The
payoff is immediate and worth testing: with a semicolon delimiter a comma loses its
special meaning and becomes ordinary field content, which is the whole reason
semicolon files exist in comma-using locales. One state machine, many dialects.
