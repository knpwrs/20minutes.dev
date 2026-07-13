---
project: build-an-expression-evaluator
lesson: 2
title: Scanning an integer
overview: Numbers are the atoms of every expression, so the tokenizer needs to recognize a run of digits as a single Number token. Today you scan one integer and capture both its text and where it started.
goal: Scan a run of digit characters into a single Number token.
spec:
  scenario: A run of digits becomes one Number token
  status: failing
  lines:
    - kw: Given
      text: 'the input "42"'
    - kw: When
      text: 'it is tokenized'
    - kw: Then
      text: 'the first token has kind Number, text "42", and position 0'
    - kw: And
      text: 'it is followed by an EOF token at position 2'
code:
  lang: go
  source: |
    // walk a cursor; when it lands on a digit, consume the whole run
    for i < len(in) {
      c := in[i]
      switch {
      case c >= '0' && c <= '9':
        j := i
        for j < len(in) && in[j] >= '0' && in[j] <= '9' { j++ }
        toks = append(toks, Token{Number, in[i:j], i})
        i = j
      }
    }
checkpoint: The tokenizer recognizes multi-digit integers as single Number tokens. Commit and stop here.
---

A number is more than one character, so scanning it means **consuming a run**: when
the cursor lands on a digit, keep advancing a second cursor while it still sees
digits, then emit one `Number` token spanning the whole run. The token's text is the
exact slice of input it covered, and its position is where the run **started**, not
where it ended. Capturing the start position now is what will let a later error
message say "the number at position 0."

The outer loop advances one character at a time, but a number consumes several at
once, so after emitting the token you jump the main cursor past the whole run.
Getting that jump right, so the cursor never rescans a character it already
consumed, is the small discipline every scanner rule follows.
