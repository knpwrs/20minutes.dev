---
project: build-a-json-parser
lesson: 2
title: The six structural punctuators
overview: JSON's skeleton is punctuation - braces wrap objects, brackets wrap arrays, colons and commas separate. Today you teach the scanner to recognize those six single-character tokens, the frame every value hangs on.
goal: Scan each of the six structural characters into its own distinct token kind.
spec:
  scenario: Scanning the structural characters
  status: failing
  lines:
    - kw: Given
      text: 'the input "{}[]:," '
    - kw: When
      text: it is scanned
    - kw: Then
      text: 'the token kinds are, in order, LBrace, RBrace, LBracket, RBracket, Colon, Comma, then EOF'
    - kw: And
      text: 'scanning "[]" alone yields LBracket, RBracket, EOF'
code:
  lang: go
  source: |
    // add one Kind per punctuator alongside EOF
    const (
      EOF Kind = iota
      LBrace; RBrace; LBracket; RBracket; Colon; Comma
    )
    // walk byte by byte; each of these maps to exactly one token
    // switch input[i] { case '{': ... '}': ... '[': ... etc }
checkpoint: The scanner turns JSON's punctuation into a token stream. Commit and stop here.
---

An object is written `{ ... }`, an array `[ ... ]`, a key and value are joined by
`:`, and siblings are separated by `,`. Those six characters are the **structural
tokens** - the load-bearing frame of every JSON document. They are the easiest
tokens to scan because each is exactly one character and maps to exactly one kind,
with no value to decode.

Walk the input one byte at a time and, for each of these six characters, append the
matching token. Append the final EOF when you run off the end. You are building the
punctuation vocabulary now; the literals, strings, and numbers that fill the gaps
between this punctuation come next. Keep the loop simple - a `switch` on the current
byte is all it takes today.
