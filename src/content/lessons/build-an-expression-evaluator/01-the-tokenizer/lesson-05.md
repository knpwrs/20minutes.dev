---
project: build-an-expression-evaluator
lesson: 5
title: Parenthesis tokens
overview: Parentheses let an expression override precedence, so the scanner needs to recognize them as their own two kinds of token. Today you scan an opening and a closing parenthesis into distinct tokens.
goal: Emit an LParen token for "(" and an RParen token for ")".
spec:
  scenario: Parentheses scan to their own distinct tokens
  status: failing
  lines:
    - kw: Given
      text: 'the input "(1)"'
    - kw: When
      text: 'it is tokenized'
    - kw: Then
      text: 'the tokens are LParen at 0, Number "1" at 1, and RParen at 2'
    - kw: And
      text: 'they are followed by an EOF token at position 3'
code:
  lang: go
  source: |
    case c == '(':
      toks = append(toks, Token{LParen, "(", i}); i++
    case c == ')':
      toks = append(toks, Token{RParen, ")", i}); i++
checkpoint: Parentheses scan to distinct LParen and RParen tokens. Commit and stop here.
---

Parentheses are single characters like the operators, but they get their **own two
kinds** rather than sharing the `Operator` kind, because the parser treats them
completely differently. An operator joins two values; a parenthesis instead marks
the start or end of a grouped subexpression. Distinct `LParen` and `RParen` kinds
let the parser match them without inspecting text, which keeps the later
"unclosed parenthesis" and "override precedence" logic clean.

That is the whole tokenizer strategy in miniature: give each syntactic role a kind
now, in the scanner, so that every later stage can switch on the kind and never
re-examine raw characters. With numbers, operators, and parentheses in place, you
can already tokenize most of an arithmetic expression.
