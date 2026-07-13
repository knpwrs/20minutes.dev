---
project: build-an-expression-evaluator
lesson: 3
title: Skipping whitespace
overview: Real expressions have spaces in them, and those spaces separate tokens without being tokens themselves. Today you teach the scanner to skip whitespace so that spacing never changes the token stream.
goal: Skip spaces and tabs between tokens without emitting anything for them.
spec:
  scenario: Whitespace separates tokens but produces none of its own
  status: failing
  lines:
    - kw: Given
      text: 'the input " 1  2 " (a space, 1, two spaces, 2, a trailing space)'
    - kw: When
      text: 'it is tokenized'
    - kw: Then
      text: 'the tokens are Number "1" at position 1 and Number "2" at position 4'
    - kw: And
      text: 'they are followed by an EOF token at position 6'
code:
  lang: go
  source: |
    switch {
    case c == ' ' || c == '\t':
      i++            // consume the whitespace, emit nothing
    case c >= '0' && c <= '9':
      // ... number scanning from last lesson ...
    }
checkpoint: Whitespace is skipped, so spacing does not affect the token stream. Commit and stop here.
---

Whitespace is a **separator**, not a token. Two numbers written `1  2` are two
`Number` tokens, and the spaces between them exist only to keep the numbers apart.
So the scanner's rule for a space or tab is the simplest one it has: advance the
cursor by one and emit nothing. Everything that is a token gets its own case;
whitespace is the one thing that gets consumed silently.

Because the position is captured when a token **starts**, skipping leading spaces
falls out naturally: the `1` in `" 1  2 "` starts at position 1 and the `2` at
position 4, exactly where they sit in the raw string. This is why positions are
byte offsets into the original input rather than a count of tokens seen, and it is
what will make a later error point at the right column even in a spaced-out
expression.
