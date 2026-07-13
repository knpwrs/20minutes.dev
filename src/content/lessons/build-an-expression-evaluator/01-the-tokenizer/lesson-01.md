---
project: build-an-expression-evaluator
lesson: 1
title: The token type and an empty input
overview: Before you can parse anything you need to split a string into the small pieces a parser understands, called tokens. Today you define the token type and tokenize the simplest possible input, the empty string, which yields a single end-of-input marker.
goal: Define a token that carries a kind, its text, and its position, and tokenize an empty string.
spec:
  scenario: An empty input produces a single end-of-input token
  status: failing
  lines:
    - kw: Given
      text: 'the empty string as input'
    - kw: When
      text: 'it is tokenized'
    - kw: Then
      text: 'the result is exactly one token of kind EOF'
    - kw: And
      text: 'that token has position 0 (the length of the input)'
code:
  lang: go
  source: |
    type Kind int
    const ( EOF Kind = iota; Number; Operator; LParen; RParen; Ident; Comma; Illegal )
    type Token struct { Kind Kind; Text string; Pos int }
    // scan left to right; here there is nothing to scan, so just
    // append the terminating EOF at the end of the input
    func Tokenize(in string) []Token {
      var toks []Token
      // ... scanning goes here in later lessons ...
      return append(toks, Token{EOF, "", len(in)})
    }
checkpoint: You have a token type and a tokenizer that terminates every stream with an EOF token. Commit and stop here.
---

A parser does not work on raw characters; it works on **tokens**, the meaningful
chunks of the input: a number, an operator, a parenthesis. The **tokenizer** (also
called a lexer or scanner) is the first stage of the pipeline, and everything else
builds on the stream it produces. A token needs three things: its **kind** (what it
is), its **text** (the exact characters it came from), and its **position** (where
in the input it started). That position rides along unused for a while, but it is
what lets error messages later point at exactly where something went wrong.

Every token stream ends with a special **EOF** token so later stages have an
unambiguous "nothing more to read" marker instead of checking lengths everywhere.
Its position is the length of the input, which is the offset just past the last
character. Defining the full set of kinds up front, even though most stay unused
today, keeps the type stable as you teach the scanner one character class at a time.
