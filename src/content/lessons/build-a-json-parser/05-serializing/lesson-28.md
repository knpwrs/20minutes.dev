---
project: build-a-json-parser
lesson: 28
title: Round-trip equivalence
overview: The real test of a parser-serializer pair is that they undo each other. Today you add a value-equality check and prove that parsing then serializing returns the document unchanged.
goal: Add value equality and prove parse then serialize is the identity on canonical JSON.
spec:
  scenario: Parse and serialize are inverses
  status: failing
  lines:
    - kw: Given
      text: 'the canonical compact document {"a":[1,2],"b":null}'
    - kw: When
      text: 'it is parsed and then serialized'
    - kw: Then
      text: 'the serialized text equals the original document exactly'
    - kw: And
      text: 'Equal reports the tree from parsing the document is equal to the tree from parsing the serialized text, and Equal is false between Number 1 and Bool true'
code:
  lang: go
  source: |
    // Equal(a, b Value) bool: same Kind, then compare payloads;
    //   arrays: same length, elements Equal in order
    //   objects: same length, members Equal in order (key and value)
    // round-trip test: Serialize(mustParse(s)) == s for canonical s
    //   and Equal(mustParse(s), mustParse(Serialize(mustParse(s))))
checkpoint: Parsing and serializing round-trip canonical documents exactly. Commit and stop here.
---

A parser and serializer that agree should form a **round-trip**: take canonical JSON
(already compact, no insignificant whitespace), parse it into a tree, serialize the
tree, and get the original text back byte for byte. This is the strongest single
check that both halves are correct, and it usually needs no new production code -
just the two functions you already have, plus a way to compare trees.

That comparison is `Equal`, a deep structural equality on values: same kind, and then
the same payload, recursing into array elements and object members in order. With it
you can state round-trip two ways: the text form (`Serialize(Parse(s)) == s`) and the
tree form (parsing the serialized output yields a tree `Equal` to the original). Both
should hold for canonical input. Note the boundaries that prevent a perfect
byte-round-trip in general - insignificant whitespace, key ordering from a hash-based
source, `-0`, escaped-vs-literal Unicode - all collapse to a canonical form here,
which is exactly what makes the identity clean.
