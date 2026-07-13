---
project: build-a-programming-language
lesson: 7
title: String literals
overview: A string literal runs from an opening quote to a closing quote and can contain anything in between. Today you teach the lexer to read that span into a single STRING token holding just the text inside the quotes.
goal: Read a double-quoted span into one STRING token whose literal is the text between the quotes.
spec:
  scenario: Lexing string literals
  status: failing
  lines:
    - kw: Given
      text: 'the source string containing "hello" wrapped in double quotes'
    - kw: When
      text: 'the lexer produces tokens until the end'
    - kw: Then
      text: 'it emits one STRING token whose literal is hello, with the quotes removed'
    - kw: And
      text: 'an empty "" yields a STRING token whose literal is the empty string'
code:
  lang: go
  source: |
    func (l *Lexer) readString() string {
      start := l.position + 1        // skip the opening quote
      for {
        l.readChar()
        if l.ch == '"' || l.ch == 0 { break }
      }
      return l.input[start:l.position]
    }
checkpoint: The lexer reads a double-quoted span into one STRING token holding the inner text. Commit.
---

A string is bounded by **delimiters** rather than by the kind of characters it
contains: it starts at a `"` and runs until the next `"`. So the lexer's loop is
different from numbers and identifiers - instead of reading while the character
belongs to the token, it reads *until* it hits the closing quote.

Store only the text *between* the quotes as the literal, since the quotes are
just markers. Watch the boundaries: an empty `""` is a valid string of length
zero, and hitting end-of-input before a closing quote means the string was never
closed - stop there so the loop cannot run off the end. Escapes like `\n` are a
refinement you can add later.
