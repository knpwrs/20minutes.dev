---
project: build-an-expression-evaluator
lesson: 4
title: Operator tokens
overview: Expressions are numbers joined by operators, so the scanner needs to recognize the six arithmetic operators as their own tokens. Today you emit an Operator token for each, and confirm that two operators sitting next to each other stay two separate tokens.
goal: Emit a single-character Operator token for each of + - * / % and ^.
spec:
  scenario: Each operator character becomes its own token
  status: failing
  lines:
    - kw: Given
      text: 'the input "2*-3"'
    - kw: When
      text: 'it is tokenized'
    - kw: Then
      text: 'the tokens are Number "2" at 0, Operator "*" at 1, Operator "-" at 2, and Number "3" at 3'
    - kw: And
      text: 'they are followed by an EOF token at position 4, and tokenizing "@" gives an Illegal token "@" at position 0 then EOF at position 1'
code:
  lang: go
  source: |
    case c=='+' || c=='-' || c=='*' || c=='/' || c=='%' || c=='^':
      toks = append(toks, Token{Operator, string(c), i})
      i++
    default:
      // anything unrecognized becomes an Illegal token so the scanner
      // always makes progress and the parser can reject it later
      toks = append(toks, Token{Illegal, string(c), i})
      i++
checkpoint: The six arithmetic operators each scan to their own Operator token. Commit and stop here.
---

Each of the six operators is a single character, so its rule is trivial: emit one
`Operator` token whose text is that character and advance by one. The interesting
case is what happens when operators are **adjacent**. In `2*-3` the `*` and `-` sit
side by side, and the scanner must keep them as two separate one-character tokens
rather than trying to combine them into some `*-` operator. Because each operator
rule consumes exactly one character, this falls out for free: the parser will later
read `-3` as a negation of `3`, but that is the parser's job, not the scanner's.

Give the scanner a **default** case too, for any character it does not recognize.
Emitting an `Illegal` token (and still advancing) means the scanner always makes
progress and never loops forever on stray input like `@`; the parser can turn that
`Illegal` token into a clear error further down the line.
