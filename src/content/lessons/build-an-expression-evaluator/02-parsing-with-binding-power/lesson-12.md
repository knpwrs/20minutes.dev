---
project: build-an-expression-evaluator
lesson: 12
title: Right-associative power
overview: Exponentiation groups the opposite way from the other operators, right to left, and it binds tighter than unary minus. Today you add the power operator with a right binding power below its left, and pin the -2^2 convention.
goal: Add ^ as a right-associative operator whose power sits above unary minus.
spec:
  scenario: Power is right-associative and binds above unary minus
  status: failing
  lines:
    - kw: Given
      text: 'the input "2 ^ 3 ^ 2"'
    - kw: When
      text: 'it is parsed and rendered with String'
    - kw: Then
      text: 'the rendering is "(2 ^ (3 ^ 2))", grouping right to left'
    - kw: And
      text: 'parsing "-2 ^ 2" renders as "(-(2 ^ 2))", so the power binds tighter than the leading minus'
code:
  lang: go
  source: |
    // add to infixBP, with RIGHT power one BELOW left power:
    case "^": return 40, 39, true
    // left 40 is above prefixBP (30), so -2^2 parses as -(2^2)
checkpoint: The power operator is right-associative and binds above unary minus. Commit and stop here.
---

Exponentiation is **right-associative**: `2 ^ 3 ^ 2` means `2 ^ (3 ^ 2)`, which is
`2 ^ 9 = 512`, not `(2 ^ 3) ^ 2 = 64`. In the binding-power model, right
associativity is the mirror of left: make the **right** power one **below** the left
power. With `^` at left `40` and right `39`, parsing the right operand of the first
`^` uses floor `39`, and the second `^` at left `40` **is** above `39`, so it gets
pulled into the right operand. The grouping leans right, exactly as required.

The `-2 ^ 2` question is a real convention choice, and different tools answer it
differently. This project follows the mathematical convention, where the power binds
tighter than the leading minus, so `-2 ^ 2` is `-(2 ^ 2) = -4`, not `(-2) ^ 2 = 4`.
That falls straight out of the numbers: `^` at left power `40` outranks unary minus at
`30`, so when the negation parses its operand with floor `30`, the `^` reaches in and
takes the `2 ^ 2`. Your parser is now complete for arithmetic; the tree it builds is
what the evaluator will walk.
