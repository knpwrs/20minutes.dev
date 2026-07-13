---
project: build-a-spell-checker
lesson: 38
title: A human-readable report
overview: The tool's output should be a line a person can read, not a struct dump. Today you format each Issue into a single readable sentence with its location and suggestions.
goal: Render an Issue as one human-readable line naming the location, the word, and its suggestions.
spec:
  scenario: Formatting an issue as a report line
  status: failing
  lines:
    - kw: Given
      text: 'an Issue for "teh" at line 1, column 1, with suggestions ["the", "ten"]'
    - kw: When
      text: it is formatted
    - kw: Then
      text: 'the line is exactly: line 1, col 1: "teh" -> did you mean "the", "ten"?'
    - kw: And
      text: 'an Issue with no suggestions formats as: line 1, col 1: "teh" -> (no suggestions)'
code:
  lang: go
  source: |
    func FormatIssue(i Issue) string {
      // "line %d, col %d: \"%s\" -> did you mean \"a\", \"b\"?"
      // join the quoted suggestions with ", "; if none, use "(no suggestions)"
    }
checkpoint: Issues render as readable report lines. Commit and stop here.
---

The final presentation step turns an `Issue` into a **sentence**. The format names
the location the way lesson 37 computes it, quotes the offending word, and lists the
suggestions as a friendly "did you mean" prompt - the shape of output a user
actually reads and acts on. Quoting each suggestion and joining them with commas
keeps a multi-word menu legible.

Handling the empty case matters: a word with nothing within two edits has no
suggestions, and the report should say so plainly (`(no suggestions)`) rather than
trailing off after "did you mean". Because `Correct` is total and always returns
*something*, a truly empty suggestion list is rare, but the formatter is honest
about it when it happens. With formatting done, every piece of the tool exists - the
capstone wires them into a program that reads a whole passage and prints its report.
