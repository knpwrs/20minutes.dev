---
project: build-a-json-parser
lesson: 3
title: Skipping whitespace and recording offsets
overview: Real JSON is padded with spaces and newlines between tokens, and good error messages need to point at an exact spot. Today you teach the scanner to skip insignificant whitespace and to stamp every token with the byte offset where it started.
goal: Skip JSON whitespace between tokens and record each token's starting byte offset.
spec:
  scenario: Offsets survive surrounding whitespace
  status: failing
  lines:
    - kw: Given
      text: 'the input " [ ] " (space, bracket, space, bracket, space)'
    - kw: When
      text: it is scanned
    - kw: Then
      text: 'the LBracket has Offset 1, the RBracket has Offset 3, and the EOF has Offset 5'
    - kw: And
      text: 'the four whitespace bytes recognized are space, tab, line feed, and carriage return'
code:
  lang: go
  source: |
    // add an Offset field to Token
    type Token struct { Kind Kind; Offset int }
    // before reading a token, advance past any whitespace:
    //   for i < len(input) && isSpace(input[i]) { i++ }
    // isSpace is true for ' ', '\t', '\n', '\r' - and nothing else
    // stamp the token with i (the index where it starts) before consuming it
checkpoint: Tokens carry their byte offset and whitespace no longer produces tokens. Commit and stop here.
---

JSON treats four bytes as insignificant **whitespace**: the space, the tab
(`\t`), the line feed (`\n`), and the carriage return (`\r`). They may appear
between any two tokens and carry no meaning, so the scanner simply skips over them
before reading each token. Nothing else counts as whitespace - a vertical tab or a
Unicode space is not allowed between tokens, and later that will be an error.

The other half of today is **position**. Every token remembers the **byte offset**
where it began, so that when something goes wrong the parser can say exactly where.
Record the offset the moment before you consume a token, after skipping any leading
whitespace. Note that the trailing EOF also gets an offset - the length of the
input - which is where an "unexpected end of input" error will eventually point.
