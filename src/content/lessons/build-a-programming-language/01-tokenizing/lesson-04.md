---
project: build-a-programming-language
lesson: 4
title: Integer literals
overview: Numbers are the first token whose length you do not know up front - a digit could be followed by more digits. Today you teach the lexer to read a whole run of digits into a single INT token.
goal: Read a run of digit characters into one INT token carrying the full number as its literal.
spec:
  scenario: Lexing multi-digit integers
  status: failing
  lines:
    - kw: Given
      text: 'the source string 12+3'
    - kw: When
      text: 'the lexer produces tokens until the end'
    - kw: Then
      text: 'the tokens are INT "12", PLUS "+", INT "3", EOF'
    - kw: And
      text: 'the literal of the first token is the two-character string 12, not 1'
code:
  lang: go
  source: |
    func (l *Lexer) readNumber() string {
      start := l.position
      for isDigit(l.ch) { l.readChar() }
      return l.input[start:l.position]
    }
    func isDigit(ch byte) bool { return '0' <= ch && ch <= '9' }
checkpoint: The lexer reads whole integers as one INT token. Commit.
---

Single-character tokens were easy because you knew where they ended. A number is
the first **multi-character** token: when the lexer sees a digit, it does not yet
know how many more digits follow. So instead of returning immediately, it reads
forward while the character is still a digit, then stops on the first
non-digit.

The token's literal is the whole slice of digits - `"12"`, not `1` followed by a
mystery. Keep the literal as text for now; the parser will convert it to an
actual number later. Identifiers, in the next lesson, use exactly this
read-while-it-matches shape.
