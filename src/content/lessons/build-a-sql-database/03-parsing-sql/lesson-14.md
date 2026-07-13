---
project: build-a-sql-database
lesson: 14
title: The token cursor
overview: A parser reads tokens the way the tokenizer read characters - one at a time, with a peek ahead. Today you build the cursor that every parsing rule will use to walk the token list.
goal: Build a cursor over a token list that can peek at the current token, advance past it, and require a specific token.
spec:
  scenario: Walking a token list with a cursor
  status: failing
  lines:
    - kw: Given
      text: 'a cursor over the tokens [Keyword(SELECT), Star, EOF]'
    - kw: When
      text: peek is called
    - kw: Then
      text: it returns Keyword(SELECT) without advancing
    - kw: And
      text: after next() is called, peek returns Star
    - kw: And
      text: 'expect(Star) succeeds and advances, but expect(Comma) reports an error'
code:
  lang: go
  source: |
    type Parser struct { tokens []Token; pos int }
    func (p *Parser) peek() Token { return p.tokens[p.pos] }
    func (p *Parser) next() Token { t := p.peek(); p.pos++; return t }
    func (p *Parser) expect(k TokKind) (Token, error) { /* match or error */ }
checkpoint: The parser can peek, advance, and demand a specific token. Commit and stop here.
---

A **recursive-descent parser** is a set of small functions that each recognize
one piece of grammar, and they all share one piece of state: a **cursor** into
the token list. Three operations cover everything the grammar rules need.
`peek` looks at the current token without consuming it - that is how a rule
decides what to do next. `next` consumes and returns the current token. And
`expect` consumes a token only if it is the kind you require, reporting a syntax
error otherwise.

That third one encodes the grammar's demands: "after `FROM` I *must* see an
identifier" becomes `expect(Identifier)`. Because the tokenizer ended the list
with an `EOF` token, the cursor never runs off the end - `peek` at the end just
keeps returning `EOF`. With these three methods in hand, each grammar rule you
write next reads almost exactly like the SQL it parses.
