---
project: build-a-programming-language
lesson: 46
title: Hash literals
overview: The second compound structure is the hash - a map from keys to values. Today you parse hash literals and evaluate them into a runtime hash, deriving a hashable key from each key object so it can be stored.
goal: Parse and evaluate a hash literal into a hash object keyed by hashable keys.
spec:
  scenario: Evaluating a hash literal
  status: failing
  lines:
    - kw: Given
      text: 'the source {"one": 1, "two": 1 + 1}'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is a hash with two entries'
    - kw: And
      text: 'the entry stored under the key "one" holds 1 and the entry under "two" holds 2 (its value expression was evaluated)'
code:
  lang: go
  source: |
    type HashLiteral struct { Pairs map[Expression]Expression }   // AST node
    type Hash struct { Pairs map[HashKey]HashPair }               // runtime object
    // a HashKey is derived from a key object's type + value, so strings,
    // integers, and booleans can be map keys; give those objects a HashKey()
    // parse '{' as a prefix parse fn: comma-separated key ':' value pairs
    // eval: evaluate each key and value; store under the key's HashKey()
checkpoint: Hash literals evaluate into a hash keyed by hashable keys. Commit.
---

A **hash** maps keys to values, written `{"one": 1, "two": 2}`. Parsing registers
`{` as a prefix parse function reading comma-separated `key: value` pairs into a
`HashLiteral`. Evaluating it builds a runtime `Hash`, evaluating every key and
value expression - so `{"two": 1 + 1}` stores `2`.

The wrinkle is the key: object pointers cannot be map keys directly (two equal
strings would be different pointers), so derive a small **hash key** from each key
object's type and value, and give the hashable object kinds - strings, integers,
and booleans - a `HashKey()` method that produces it. Store each pair under that
derived key. You can't read values back out yet; the index operator learns to
look into a hash in the next lesson.
