---
project: build-a-programming-language
lesson: 13
title: Comparison operators
overview: Comparisons like < and == bind looser than arithmetic, so 1 + 2 < 3 compares the sum. Today you add two more precedence levels for the comparison and equality operators.
goal: Parse comparison and equality operators at their own precedence levels, below arithmetic.
spec:
  scenario: Comparison binds looser than arithmetic
  status: failing
  lines:
    - kw: Given
      text: 'the source 5 > 4 == 3 < 4'
    - kw: When
      text: 'the parser parses the program and prints it'
    - kw: Then
      text: 'the printed form is ((5 > 4) == (3 < 4))'
    - kw: And
      text: 'parsing 1 + 2 < 3 prints ((1 + 2) < 3)'
code:
  lang: go
  source: |
    const ( LOWEST = iota; EQUALS; LESSGREATER; SUM; PRODUCT )
    // add to the precedence map:
    //   "==" and "!=" -> EQUALS
    //   "<"  and ">"  -> LESSGREATER
    // the parseInfix code does not change - only the level table does
checkpoint: Comparison and equality operators parse at their own precedence, below arithmetic. Commit.
---

Comparisons slot in as two more **precedence levels** beneath arithmetic: `<` and
`>` (call it LESSGREATER) bind looser than `+`/`-`, and `==`/`!=` (EQUALS) looser
still. Because arithmetic binds tighter, `1 + 2 < 3` naturally parses the `1 + 2`
first and then compares the result, giving `((1 + 2) < 3)`.

The satisfying part: you write no new parsing code. The Pratt loop from the last
lesson already consults the precedence table, so adding operators is just adding
rows to that table. `5 > 4 == 3 < 4` grouping as `((5 > 4) == (3 < 4))` falls out
for free - a good sign your precedence machinery is right rather than
special-cased.
