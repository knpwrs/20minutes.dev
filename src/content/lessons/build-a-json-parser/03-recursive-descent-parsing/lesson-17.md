---
project: build-a-json-parser
lesson: 17
title: Arbitrary nesting composes
overview: Recursive descent means depth costs nothing extra - a value inside an array inside an object just works. Today you prove it by parsing a mixed, multi-level document and reading a leaf out of the tree.
goal: Parse a deeply mixed document and confirm the nested value tree is correct.
spec:
  scenario: A mixed nested document
  status: failing
  lines:
    - kw: Given
      text: 'the input {"a":[1,{"b":true}],"c":null}'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'the result is an Object whose member a is an Array of Number 1 then an Object with member b of Bool true, and whose member c is Null'
    - kw: And
      text: 'reading the path a then index 1 then b yields Bool true'
code:
  lang: go
  source: |
    // no new parser code is expected here - arrays call parseValue,
    // objects call parseValue, and parseValue handles every kind.
    // write the test that walks into the tree:
    //   root.Obj[0].Value.Arr[1].Obj[0].Value  == Bool true
checkpoint: Deeply nested mixed documents parse correctly. Commit and stop here.
---

This is the payoff of building the parser as **mutual recursion**. `parseValue`
handles arrays by calling `parseValue` on each element, handles objects by calling
`parseValue` on each member's value, and every one of those calls can itself be an
array or object. Nothing in the code mentions "depth", yet a document nested four
levels deep parses as easily as a flat one. Often a lesson like this adds no new
production code at all - the mechanism was built correctly earlier, and today simply
demonstrates that it holds.

That is worth confirming on purpose, because the composition is the whole point of
the design. Parse a document that mixes all the container and scalar kinds across
several levels, then reach into the resulting tree and pull out a leaf to prove the
structure is exactly right. If this works, the parser's happy path is complete;
what remains is making the failures precise, which the next chapter does.
