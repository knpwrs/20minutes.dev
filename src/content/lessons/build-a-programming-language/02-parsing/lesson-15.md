---
project: build-a-programming-language
lesson: 15
title: Boolean and string literals
overview: The language has two more literal kinds - the booleans true and false, and string literals. Today you parse both as leaf expressions so they can appear anywhere a value can.
goal: Parse boolean and string literals as leaf expressions that print as their own value.
spec:
  scenario: Parsing boolean and string literals
  status: failing
  lines:
    - kw: Given
      text: 'the source true'
    - kw: When
      text: 'the parser parses the program and prints it'
    - kw: Then
      text: 'the printed form is true'
    - kw: And
      text: 'parsing 3 > 5 == false prints ((3 > 5) == false)'
code:
  lang: go
  source: |
    type Boolean struct { Value bool }
    func (b *Boolean) String() string { if b.Value { return "true" }; return "false" }
    // StringLiteral{ Value string } is the same shape - String returns the text.
    // register 'true'/'false' and STRING as prefix parse functions.
checkpoint: Boolean and string literals parse as leaves and slot into larger expressions. Commit.
---

Booleans and strings are **leaf expressions**, just like integers and
identifiers: they have no children, and they print as their own value. Register a
prefix parse function for the `true` and `false` keywords that builds a `Boolean`
node, and one for `STRING` tokens that builds a `StringLiteral` carrying the
text.

The headline is the boolean, because it slots straight into the precedence
machinery: `3 > 5 == false` parses as `((3 > 5) == false)`, with the comparison
binding before the equality - a boolean can appear anywhere a value can. String
literals are the same idea with less to say; both are simple, but they complete
the set of atoms your expressions are built from.
