---
project: build-a-json-parser
lesson: 14
title: Parsing arrays
overview: An array is a value that contains other values, which is where recursive descent earns its name. Today you parse bracketed, comma-separated lists by calling the value parser on each element.
goal: Parse a bracketed, comma-separated list of values into an Array value.
spec:
  scenario: Parsing arrays of values
  status: failing
  lines:
    - kw: Given
      text: 'a bracketed list'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Parse("[]") is an empty Array, Parse("[1,2,3]") is an Array of Number 1, 2, 3, and Parse("[true,null]") is an Array of Bool true then Null'
    - kw: And
      text: 'Parse("[[1],2]") is an Array whose first element is an Array containing Number 1'
code:
  lang: go
  source: |
    // parseValue sees an LBracket:
    //   consume it; if the next token is RBracket, it is the empty array
    //   else loop: parseValue (recursion!), then expect ',' to continue
    //   or ']' to stop
    // append each parsed element to Arr
checkpoint: Parse builds Array values, including nested arrays. Commit and stop here.
---

An **array** is a value that holds an ordered list of other values, written
`[ ... ]` with commas between elements. Parsing it is the first taste of **recursive
descent**: to read an element you call the very same value parser you are already
inside, so an array of arrays falls out for free. When the parser sees a left
bracket, it reads values in a loop, expecting a comma between each and a right
bracket to finish.

The one special case is the **empty array**: right after the opening bracket, a
closing bracket means zero elements, with no value to read. Otherwise each iteration
parses one value and then looks at the next token - a comma means "another element
follows", a closing bracket means "done". Because the element parser is the general
one, `[[1],2]` nests naturally: the first element recurses into another array. Keep
the happy path clean today; malformed lists like a trailing comma get precise errors
in the errors chapter.
