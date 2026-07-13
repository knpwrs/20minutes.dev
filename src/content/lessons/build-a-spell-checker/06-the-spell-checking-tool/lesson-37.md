---
project: build-a-spell-checker
lesson: 37
title: Line and column
overview: A byte offset is precise but unfriendly - a person wants "line 2, column 1". Today you convert each Issue's offset into a line and column so the report can point at a spot the way an editor does.
goal: Translate a token's byte offset into a 1-based line and column within the text.
spec:
  scenario: Locating a word by line and column
  status: failing
  lines:
    - kw: Given
      text: 'the text "cat\ndog xyz" (a newline after "cat")'
    - kw: When
      text: 'the offset of "xyz" (8) is converted to a line and column'
    - kw: Then
      text: 'it is line 2, column 5'
    - kw: And
      text: 'the offset of "cat" (0) is line 1, column 1 - both line and column are 1-based, and a newline starts a new line'
    - kw: And
      text: 'the Issue now carries Line and Col fields, and Check stamps each flagged Issue with LineCol of its start offset'
code:
  lang: go
  source: |
    // add Line, Col int to the Issue struct; Check fills them via
    // LineCol(text, token.Start) as it builds each Issue
    func LineCol(text string, offset int) (line, col int) {
      // line = 1 + number of '\n' before offset
      // col  = 1 + offset - (index just past the last '\n' before offset)
    }
checkpoint: Every flagged word can be reported by line and column. Commit and stop here.
---

A checker that says "problem at byte 47" is technically correct and humanly
useless. People locate text by **line and column**, the way every editor and
compiler reports a position, so the tool converts the token offset it has been
carrying since chapter one into that pair. Count the newlines before the offset to
get the line; measure from the character after the most recent newline to get the
column. Offsets are byte offsets, the same ones the tokenizer records, so byte 8 in
`cat\ndog xyz` is the `x` that starts `xyz` (byte 7 is the space before it).

Both are **1-based** - the first character is line 1, column 1 - because that is the
convention every reader expects. In `cat\ndog xyz`, the `xyz` at byte 8 sits on the
second line, five columns in, so it reports as line 2, column 5. The `Checker`
stamps this onto each `Issue`, giving the report the coordinates a user can actually
navigate to. With the word, its suggestions, and now its place, the `Issue` is
complete - the next lesson renders it for a human to read.
