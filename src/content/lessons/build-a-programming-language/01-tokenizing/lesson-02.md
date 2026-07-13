---
project: build-a-programming-language
lesson: 2
title: Single-character tokens
overview: A lexer turns raw source text into a stream of tokens - the words of the language. Today you build the lexer's core and teach it the punctuation that is exactly one character, the simplest tokens there are.
goal: Turn a string of single-character symbols into a sequence of typed tokens ending in EOF.
spec:
  scenario: Lexing single-character symbols
  status: failing
  lines:
    - kw: Given
      text: 'the source string =+-*/<>(){},;'
    - kw: When
      text: 'the lexer produces tokens one at a time until the end'
    - kw: Then
      text: 'the token types are ASSIGN, PLUS, MINUS, ASTERISK, SLASH, LT, GT, LPAREN, RPAREN, LBRACE, RBRACE, COMMA, SEMICOLON in that order'
    - kw: And
      text: 'the final token is EOF'
code:
  lang: go
  source: |
    type Token struct { Type string; Literal string }
    // a lexer walks the input one character at a time
    func (l *Lexer) NextToken() Token {
      switch l.ch {
      case '=': return Token{ASSIGN, "="}
      case '+': return Token{PLUS, "+"}
      case '-': return Token{MINUS, "-"}
      // ... one case per symbol (+ - * / < > and the delimiters); 0 means end -> EOF
      }
    }
checkpoint: The lexer emits a typed token for each single-character symbol and an EOF at the end. Commit.
---

A **token** is a small tagged piece of the source: a type (what kind of thing it
is) and the literal text it came from. The lexer's job is to walk the input
character by character and hand back one token each time you ask, so later stages
never touch raw text - they work with a clean stream of `PLUS`, `LPAREN`,
`SEMICOLON`, and so on.

Start with the symbols that are always exactly one character. A `switch` on the
current character, returning the matching token type, is the whole idea. Reaching
the end of the input is itself a token - **EOF** - so parsers downstream have a
definite signal to stop rather than reading off the end.
