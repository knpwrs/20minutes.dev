---
project: build-a-programming-language
lesson: 6
title: Two-character operators
overview: Some operators are two characters that start with a one-character operator - == begins like =, != begins like !. Today you teach the lexer to peek at the next character to tell them apart.
goal: Lex the two-character operators == and != distinctly from the single-character = and !.
spec:
  scenario: Distinguishing one- and two-character operators
  status: failing
  lines:
    - kw: Given
      text: 'the source string "== != = !"'
    - kw: When
      text: 'the lexer produces tokens until the end'
    - kw: Then
      text: 'the token types are EQ, NOT_EQ, ASSIGN, BANG, EOF'
    - kw: And
      text: 'the literal of the EQ token is the two-character string =='
code:
  lang: go
  source: |
    case '=':
      if l.peekChar() == '=' {      // look ahead without consuming
        l.readChar()
        return Token{EQ, "=="}
      }
      return Token{ASSIGN, "="}
    // peekChar returns the next char but does not advance
checkpoint: The lexer distinguishes == from = and != from ! by looking one character ahead. Commit.
---

Now that a single character no longer always determines the token, the lexer
needs to **look ahead**. When it sees `=`, the token is `ASSIGN` only if the
*next* character is not another `=`; if it is, the two together are the equality
operator `EQ`. The same choice separates `!` (`BANG`) from `!=` (`NOT_EQ`).

The tool is a `peekChar` that returns the next character without advancing. Peek,
decide, and only consume the second character when it is really part of a
two-character operator. This look-ahead-by-one is the same trick every lexer uses
for multi-character operators, and it keeps `!` usable on its own as the "not"
operator you will need soon.
