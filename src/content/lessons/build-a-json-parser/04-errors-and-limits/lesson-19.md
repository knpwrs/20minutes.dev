---
project: build-a-json-parser
lesson: 19
title: Array element separators
overview: Array elements are separated by exactly one comma, so both a comma with no element after it and two elements with no comma between them are errors. Today you pin both, tightening the array parser.
goal: Reject a trailing or leading comma and a missing comma in an array, each at the offending token.
spec:
  scenario: Commas that are missing or extra
  status: failing
  lines:
    - kw: Given
      text: 'an array whose elements are not cleanly comma-separated'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Parse("[1,]") gives "expected a value at line 1, column 4" and Parse("[,]") gives "expected a value at line 1, column 2"'
    - kw: And
      text: 'Parse("[1 2]") gives "expected comma or closing bracket at line 1, column 4" (a missing separator), and Parse("[1,2,]") gives "expected a value at line 1, column 6"'
code:
  lang: go
  source: |
    // two rules, both in the array loop:
    //  - after a ',', the next thing MUST be a value: just call
    //    parseValue, which already returns "expected a value" when
    //    the next token is ']' or another ','
    //  - after an element, the next token MUST be ',' or ']'; anything
    //    else -> ParseError "expected comma or closing bracket" at it
checkpoint: Arrays reject both extra and missing commas by position. Commit and stop here.
---

In JSON a comma inside an array is a **separator**, not a terminator: exactly one
comma sits between each pair of elements, and none trails the last. That single rule
has two failure modes. A comma with nothing after it - `[1,]` or the leading `[,]` -
promises an element that never arrives. And two elements with no comma between them -
`[1 2]` - drop the separator the grammar requires.

The trailing-comma case needs no special code: after consuming a comma the parser
loops back to read an element via `parseValue`, which already reports `expected a
value` pointing right at the closing bracket. The missing-comma case is the new work
today: after reading an element, the next token must be a comma (continue) or a
closing bracket (stop), and anything else is `expected comma or closing bracket` at
that token. Together they make the array parser strict about separation in both
directions, precisely located. Objects have the same rules with their own wording,
which is next.
