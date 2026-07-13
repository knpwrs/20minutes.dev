---
project: build-a-programming-language
lesson: 24
title: Negating numbers
overview: The other prefix operator is minus, which negates a number. Today you evaluate it, producing a new integer object with the sign flipped.
goal: Evaluate the prefix - operator on an integer, returning its negation.
spec:
  scenario: Evaluating numeric negation
  status: failing
  lines:
    - kw: Given
      text: 'a program using the prefix - operator on an integer'
    - kw: When
      text: 'the evaluator evaluates -5 and then -10'
    - kw: Then
      text: 'the results are integer objects with values -5 and -10'
    - kw: And
      text: 'evaluating --5 (minus applied twice) yields 5'
code:
  lang: go
  source: |
    func evalMinus(right Object) Object {
      // for now assume the operand really is an integer;
      // rejecting non-integers is the error-handling lesson's job
      i := right.(*Integer)
      return &Integer{Value: -i.Value}
    }
checkpoint: The prefix - operator negates integers. Commit.
---

The prefix `-` takes an integer and returns its negation as a *new* integer
object. Applied twice, `--5` negates and negates again, landing back on `5`. This
is the arithmetic counterpart to `!`, and it rounds out the two prefix operators
the language supports.

For today, assume the operand really is an integer - negating a boolean or string
is a type error, but reporting those cleanly is a job for the error-handling
lesson later in this chapter. Keep the focus narrow: unwrap the integer, flip its
sign, wrap it back up.
