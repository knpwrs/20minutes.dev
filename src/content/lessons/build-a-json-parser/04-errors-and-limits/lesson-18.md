---
project: build-a-json-parser
lesson: 18
title: Positioned errors for the unexpected
overview: A parser is only as good as its error messages. Today you make Parse report the two most basic failures - nothing where a value was expected, and the wrong token where a value was expected - each with an exact line and column.
goal: Return a ParseError with a precise position when a value is missing or unexpected.
spec:
  scenario: Reporting a missing or unexpected value
  status: failing
  lines:
    - kw: Given
      text: 'input that does not begin a valid value'
    - kw: When
      text: 'Parse is called and its error message is formatted'
    - kw: Then
      text: 'Parse("") gives the error "unexpected end of input at line 1, column 1"'
    - kw: And
      text: 'Parse("]") gives "expected a value at line 1, column 1", and Parse("[1,") gives "unexpected end of input at line 1, column 4"'
code:
  lang: go
  source: |
    // ParseError.Error() formats position:
    //   fmt.Sprintf("%s at line %d, column %d", e.Msg, e.Line, e.Col)
    // in parseValue, before switching on token kind:
    //   EOF        -> ParseError{Msg: "unexpected end of input", ...pos}
    //   not a value start -> ParseError{Msg: "expected a value", ...pos}
    // copy Offset/Line/Col straight from the offending token
checkpoint: Parse reports missing and unexpected values with exact positions. Commit and stop here.
---

Up to now the parser has only seen well-formed input. Real input is often broken,
and a good parser answers with **where** and **what**, not a crash. The `ParseError`
type already carries an offset, line, and column; today you give it an `Error()`
method that renders them as `<message> at line L, column C`, and you make
`parseValue` produce one whenever it cannot read a value.

There are two shapes of this failure. Either the stream has ended when a value was
required - an EOF token, reported as `unexpected end of input` at the EOF's position
- or the current token simply cannot start a value, like a stray closing bracket,
reported as `expected a value`. In both cases the token already carries its
position, so the error just copies it. Because arrays and objects call back into
`parseValue`, this single check also lights up mid-container failures: `[1,` runs
out of input right where the next element should be, and the error points at the
end. The next lessons name the more specific malformed shapes.
