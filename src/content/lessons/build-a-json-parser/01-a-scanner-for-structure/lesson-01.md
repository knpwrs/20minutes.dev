---
project: build-a-json-parser
lesson: 1
title: A token stream that ends in EOF
overview: Every parser starts by turning a flat string into a stream of meaningful pieces called tokens. Today you build the smallest possible scanner, one that reads nothing and reports a single end-of-input token, so the public surface exists from day one and every later lesson thickens it.
goal: Scan an empty or all-whitespace input into a one-element token stream holding a single EOF token.
spec:
  scenario: Scanning empty input
  status: failing
  lines:
    - kw: Given
      text: 'the empty input string ""'
    - kw: When
      text: it is scanned into a list of tokens
    - kw: Then
      text: 'the result is exactly one token whose kind is EOF'
    - kw: And
      text: 'scanning the all-whitespace input "   " also yields exactly one EOF token'
code:
  lang: go
  source: |
    // one Kind value per token type; EOF marks the end of input
    type Kind int
    const ( EOF Kind = iota )
    type Token struct { Kind Kind }
    // the whole scanner grows around this signature
    func Scan(input string) []Token {
      return []Token{{Kind: EOF}}
    }
checkpoint: You have an importable scanner whose token stream always ends in EOF. Commit and stop here.
---

A JSON parser never works on raw characters directly. It works on **tokens**: the
meaningful atoms of the grammar, like a left brace, a string, or a number. The
first job of any parser is a **scanner** (also called a lexer or tokenizer) that
walks the input once and produces that stream. Everything downstream reads tokens,
never bytes, so the shape of a token has to exist before anything else.

Start with the simplest possible stream. An empty input has no atoms in it, but it
still needs a way to say "there is nothing more here" so the parser knows when to
stop. That sentinel is the **EOF** token, and it always sits at the end of the
stream. Today the whole input is nothing (or only whitespace, which carries no
meaning in JSON), so the stream is just that single EOF. Keep `Scan` returning a
plain slice of tokens - the storage, the punctuation, the positions all arrive one
lesson at a time on top of this.
