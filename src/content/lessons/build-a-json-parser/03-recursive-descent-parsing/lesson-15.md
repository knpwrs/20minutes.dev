---
project: build-a-json-parser
lesson: 15
title: Parsing objects
overview: An object is a list of string keys paired with values, and it is the last container to parse. Today you read comma-separated key-colon-value members into an ordered Object value.
goal: Parse a braced list of string-keyed members into an Object value that preserves order.
spec:
  scenario: Parsing objects
  status: failing
  lines:
    - kw: Given
      text: 'a braced list of members'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Parse("{}") is an empty Object, and Parse of {"a":1,"b":2} is an Object whose members are, in order, key a with Number 1 then key b with Number 2'
    - kw: And
      text: 'the members keep their written order, so the first member key is a'
code:
  lang: go
  source: |
    // parseValue sees an LBrace:
    //   consume it; if next is RBrace, it is the empty object
    //   else loop: expect a String token (the key), then ':',
    //     then parseValue (recursion) for the value; append a Member
    //   between members expect ',', and '}' ends it
checkpoint: Parse builds ordered Object values. Commit and stop here.
---

An **object** is an unordered set of name/value pairs in the JSON data model, but
written as an ordered sequence: `{ "key": value, ... }`. Each **member** is a string
key, a colon, and a value, with commas between members. Parsing mirrors arrays -
loop over members, comma-separated, until the closing brace - with two extra steps
per member: the key must be a string token, and a colon must follow it before the
value.

Store the members as an **ordered list** of key/value pairs rather than a hash map.
Preserving the written order keeps serialization faithful and makes the value tree
easy to compare exactly, which every later lesson relies on. The value in each
member is parsed by the same recursive value parser, so objects nest inside arrays
inside objects without any special handling. What happens when the same key appears
twice is a decision of its own, and that is the next lesson.
