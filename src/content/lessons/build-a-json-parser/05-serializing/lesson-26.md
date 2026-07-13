---
project: build-a-json-parser
lesson: 26
title: Serializing arrays
overview: With scalars and strings writing themselves, arrays are just their elements joined by commas. Today you serialize arrays compactly, recursing into each element.
goal: Serialize an array value as a compact, comma-separated, bracketed list.
spec:
  scenario: Writing arrays as text
  status: failing
  lines:
    - kw: Given
      text: 'an array Value'
    - kw: When
      text: 'Serialize is called'
    - kw: Then
      text: 'an empty array is "[]", an array of Number 1, 2, 3 is "[1,2,3]", and an array of Bool true then Null is "[true,null]"'
    - kw: And
      text: 'an array whose first element is an array of Number 1 and whose second is Number 2 is "[[1],2]"'
code:
  lang: go
  source: |
    // array case of Serialize:
    //   '[' + join(Serialize(each element), ",") + ']'
    // no spaces; recurse into elements so nested arrays fall out for free
checkpoint: Arrays serialize compactly, including nested ones. Commit and stop here.
---

An array's text is the simplest of the containers: an opening bracket, each element
serialized in order and separated by a single comma, and a closing bracket. There
are **no spaces** in the compact form - readability is the pretty-printer's job, two
lessons from now. The empty array is just `[]`.

Because `Serialize` already handles every scalar and string, serializing an array
means recursing: call `Serialize` on each element and join the results. That is the
same mutual-recursion shape the parser used, run backward, so nested arrays like
`[[1],2]` serialize correctly with no special handling. Objects work the same way
and are next; then a round-trip test will prove parse and serialize are true
inverses on canonical input.
