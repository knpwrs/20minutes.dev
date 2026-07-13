---
project: build-a-json-parser
lesson: 22
title: Rejecting trailing content
overview: A JSON document is exactly one value, so anything after that value (other than whitespace) is an error. Today you make Parse insist the top-level value consumes the whole input.
goal: Report content after a complete top-level value as an error at the extra token.
spec:
  scenario: Extra tokens after the value
  status: failing
  lines:
    - kw: Given
      text: 'a complete value followed by more non-whitespace'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Parse("null null") gives "unexpected trailing content at line 1, column 6"'
    - kw: And
      text: 'Parse("[1] [2]") gives "unexpected trailing content at line 1, column 5", and Parse("1 2") gives "unexpected trailing content at line 1, column 3"'
code:
  lang: go
  source: |
    // Parse reads ONE value, then must see EOF:
    //   v := parseValue()
    //   if next token is not EOF:
    //     return ParseError{Msg: "unexpected trailing content", ...pos}
    // trailing whitespace is already skipped by the scanner, so only a
    // real extra token triggers this.
checkpoint: Parse rejects any content after the top-level value. Commit and stop here.
---

A JSON text is defined as a single value with optional surrounding whitespace -
**not** a sequence of values. So once `Parse` has read its one value, the only thing
allowed to follow is the end of input. If another token appears - a second value, a
stray bracket, leftover characters - the document is malformed, and the error points
at where the extra content begins.

This matters more than it first looks. Without the check, `Parse("[1] [2]")` would
happily return `[1]` and silently ignore the rest, hiding a real mistake. Requiring
the top value to consume everything but trailing whitespace is what makes the parser
strict about document boundaries. The scanner already skips whitespace, so a clean
document ends in EOF right after its value; anything else is `unexpected trailing
content` at the offending token. Note that a bare word like `truex` is caught even
earlier, by the scanner, as a single Illegal token.
