---
project: build-a-programming-language
lesson: 47
title: Indexing a hash
overview: A hash you can't read from is just storage. Today you teach the index operator to look into a hash by key, reusing the same node arrays use, so one operator serves both compound types.
goal: Extend the index operator to look a value up in a hash by key, returning null for a missing key.
spec:
  scenario: Indexing into a hash
  status: failing
  lines:
    - kw: Given
      text: 'hash index expressions'
    - kw: When
      text: 'the evaluator evaluates {"one": 1, "two": 2}["one"], then {"one": 1}["three"], then {1: 10}[1]'
    - kw: Then
      text: 'the results are 1, null, and 10'
    - kw: And
      text: 'a missing key yields null, the same total-indexing rule arrays follow'
code:
  lang: go
  source: |
    // extend evalIndexExpression to dispatch on the left value's type:
    //   *Array -> index by integer position (already built)
    //   *Hash  -> derive the index's HashKey() and look it up
    // a missing key returns NULL; a non-hashable index (e.g. an array) is an error
checkpoint: The index operator reads from hashes as well as arrays, returning null for missing keys. Commit and stop for today.
---

You already have the **index operator** `x[i]` from arrays; a hash just needs a
second case. When the left value is a `Hash`, derive the index's `HashKey()` and
look it up in the hash's pairs, returning `null` when the key is absent - the same
total-indexing rule arrays follow, so `hash[missing]` and `array[past-the-end]`
both yield `null` rather than erroring.

Now the single index node serves **both** compound types, dispatching on the type
of the value on its left. Your language has the two data structures - ordered
lists and keyed maps - that most programs are built from, and one uniform way to
read from either. An index whose value isn't hashable (using an array as a key,
say) has no `HashKey`, so that is a genuine error rather than `null`.
