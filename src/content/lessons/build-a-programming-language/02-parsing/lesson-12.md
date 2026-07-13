---
project: build-a-programming-language
lesson: 12
title: Operator precedence
overview: Multiplication binds tighter than addition - 1 + 2 * 3 is 1 + (2 * 3), not (1 + 2) * 3. Today you give each operator a precedence level so the parser groups them correctly.
goal: Make the parser bind multiplication and division tighter than addition and subtraction.
spec:
  scenario: Higher-precedence operators bind first
  status: failing
  lines:
    - kw: Given
      text: 'the source 1 + 2 * 3'
    - kw: When
      text: 'the parser parses the program and prints it'
    - kw: Then
      text: 'the printed form is (1 + (2 * 3))'
    - kw: And
      text: 'parsing 2 * 3 + 4 prints ((2 * 3) + 4)'
code:
  lang: go
  source: |
    const ( LOWEST = iota; SUM; PRODUCT )  // higher = binds tighter
    var precedences = map[string]int{
      "+": SUM, "-": SUM, "*": PRODUCT, "/": PRODUCT,
    }
    // parseExpression(minPrec): only keep folding while the next
    // operator's precedence is greater than minPrec; recurse with
    // the operator's own precedence for its right operand
checkpoint: Multiplication and division bind tighter than addition and subtraction. Commit.
---

Precedence is the one number that tells the Pratt loop when to stop. Give each
operator a **precedence level** - `+` and `-` low, `*` and `/` higher - and pass
a minimum precedence into `parseExpression`. The loop keeps folding operators
only while the next operator binds *tighter* than that minimum; when it sees a
weaker one, it returns and lets an outer call handle it.

That is why `1 + 2 * 3` becomes `(1 + (2 * 3))`: after parsing `1`, the parser
sees `+` (low), recurses to parse its right operand with `+`'s precedence, and
inside that call `* 3` binds tighter and is folded first. This single mechanism
scales to as many levels as you like - you will add comparison operators at their
own level next, and it just works.
