---
project: build-a-programming-language
lesson: 23
title: The bang operator and truthiness
overview: The prefix ! inverts a value's truth. Today you evaluate it, which forces the first decision about what counts as true or false in this language - its notion of truthiness.
goal: Evaluate the prefix ! operator by defining which values are truthy.
spec:
  scenario: Evaluating the bang operator
  status: failing
  lines:
    - kw: Given
      text: 'a program using the prefix ! operator'
    - kw: When
      text: 'the evaluator evaluates !true, !false, !5, and !!5'
    - kw: Then
      text: 'the results are false, true, false, and true respectively'
    - kw: And
      text: 'the rule your helper encodes is: false and null are the only non-truthy values, everything else (including 5) is truthy'
code:
  lang: go
  source: |
    func evalBang(right Object) Object {
      switch right {
      case TRUE:  return FALSE
      case FALSE: return TRUE
      case NULL:  return TRUE
      default:    return FALSE   // any other value is truthy, so ! makes it false
      }
    }
checkpoint: The bang operator inverts truthiness, and the language's truth rule is fixed. Commit.
---

Evaluating `!` forces you to answer a question every language must: which values
are **truthy**? This language keeps it simple - `false` and `null` are falsy, and
*everything else*, including `0` and empty strings, is truthy. The `!` operator is
where that rule first becomes visible.

So `!true` is `false` and `!false` is `true`. The interesting cases are `!5` →
`false` (because `5` is truthy) and `!!5` → `true` (invert twice). Your helper
should also treat `null` as non-truthy even though there is no `null` literal to
write yet - `if` and `while` will produce `null` values and lean on the exact
same definition to decide whether to take a branch or keep looping.
