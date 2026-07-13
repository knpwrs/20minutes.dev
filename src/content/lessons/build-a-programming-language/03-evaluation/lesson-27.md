---
project: build-a-programming-language
lesson: 27
title: String concatenation
overview: Strings become useful when you can join them. Today you evaluate + on two strings, producing a new string object with their contents concatenated.
goal: Evaluate the + operator on two string operands into a concatenated string object.
spec:
  scenario: Concatenating strings with plus
  status: failing
  lines:
    - kw: Given
      text: 'the source "foo" + "bar"'
    - kw: When
      text: 'the evaluator evaluates the expression'
    - kw: Then
      text: 'the result is a string object whose value is foobar'
    - kw: And
      text: 'evaluating "" + "x" yields the string x'
code:
  lang: go
  source: |
    type String struct { Value string }
    func (s *String) Type() string { return "STRING" }
    // in the infix evaluator, when both operands are strings and op is "+":
    //   return &String{ left.Value + right.Value }
    // other operators on strings will be a type error later
checkpoint: The + operator concatenates two strings into a new string object. Commit.
---

You parsed string literals back in the parsing chapter, but the evaluator has not
had a `String` object until now. Define it - a wrapper over the text with the
usual `Type`/`Inspect` - and teach the infix evaluator one new case: when both
operands are strings and the operator is `+`, produce a new string with their
contents joined.

Only `+` is defined on strings; `-`, `*`, and comparisons will be **type errors**
handled in the next lesson but one. Keep the boundary in mind - `"" + "x"` is
`"x"`, an empty string concatenates cleanly - and resist adding more string
operations today. Concatenation alone makes strings first-class enough to build
messages and, later, to see printed output from your programs.
