---
project: build-a-type-checker
lesson: 6
title: Checking a small program
overview: You have literals, variables, let, and if - enough to type a real little program. Today you point the checker at one that nests them all and confirm it both accepts good code and rejects bad code.
goal: Type-check a program that combines let, if, and literals, and reject an ill-typed variant.
spec:
  scenario: Inferring a nested program end to end
  status: failing
  lines:
    - kw: Given
      text: 'the program let x = 5 in if true then x else 10'
    - kw: When
      text: it is inferred in an empty environment
    - kw: Then
      text: 'its type is Int'
    - kw: And
      text: 'the variant let x = 5 in if x then x else 10 fails, because the condition x is Int, not Bool'
code:
  lang: go
  source: |
    // build the AST by hand and infer it:
    //   Let{"x", IntLit{5},
    //     If{BoolLit{true}, Var{"x"}, IntLit{10}}}
    // no new checker code today - this is the payoff for lessons 1-5.
    // the failing variant swaps the condition to Var{"x"} (an Int).
checkpoint: The checker types a nested let/if program and rejects the ill-typed variant. Commit and stop here.
---

Everything so far comes together here. `let x = 5 in if true then x else 10` uses
the literal rule for `5`, `true`, and `10`, the let rule to bind `x` to `Int`, the
variable rule to resolve `x` inside the body, and the conditional rule to check the
condition and the branches. No branch of `Infer` is new today; if the earlier
lessons are right, the whole program types to `Int` with no extra code.

That "no new code" is the point of a checkpoint like this - it proves the pieces
**compose**. The ill-typed variant is just as important: swap the condition to `x`,
which is an `Int`, and the checker must reject it with the same condition-not-`Bool`
error from the last lesson, now fired from deep inside a nested program. A checker
that accepts good programs is only half of the job; catching the bad one is the
half that makes it worth running. This is your first end-to-end checker for the
literal-and-`let` fragment of the language.
