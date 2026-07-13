---
project: build-a-programming-language
lesson: 3
title: Skipping whitespace
overview: Real source has spaces, tabs, and newlines between tokens, and they carry no meaning in this language. Today you teach the lexer to skip over them so it lands cleanly on the next real token.
goal: Make the lexer ignore whitespace between tokens.
spec:
  scenario: Whitespace between symbols is ignored
  status: failing
  lines:
    - kw: Given
      text: 'the source string "+  +" with two spaces between the plus signs'
    - kw: When
      text: 'the lexer produces tokens until the end'
    - kw: Then
      text: 'the token types are PLUS, PLUS, EOF'
    - kw: And
      text: 'a source of only spaces and tabs produces just EOF'
code:
  lang: go
  source: |
    func (l *Lexer) skipWhitespace() {
      for l.ch == ' ' || l.ch == '\t' || l.ch == '\n' || l.ch == '\r' {
        l.readChar()
      }
    }
    // call skipWhitespace() at the very start of NextToken()
checkpoint: Whitespace between tokens is skipped, so spacing no longer changes the token stream. Commit.
---

In this language whitespace is only a **separator** - it keeps `let x` from
reading as one word, but it is never a token itself. So before the lexer decides
what the next token is, it should fast-forward past any run of spaces, tabs, or
newlines and stop on the first meaningful character.

The fix is one small loop at the top of `NextToken`: while the current character
is whitespace, advance. After it, the lexer is guaranteed to be sitting on a real
token or the end of input. This is why `"+  +"` and `"+ +"` and `"++"` all lex to
the same two `PLUS` tokens.
