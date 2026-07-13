---
project: build-a-bloom-filter
lesson: 28
title: 'Capstone: distinct count and the whole library'
overview: The finale runs the stream through HyperLogLog for the distinct count, then stands back to see all three sketches answering their questions about one stream at once. The library is complete.
goal: Estimate the stream's distinct count with HyperLogLog and confirm all three sketches agree with the truth.
spec:
  scenario: All three sketches answer the same stream
  status: failing
  lines:
    - kw: Given
      text: 'the stream [cat, dog, the, cat, fox, the, cat, dog, the, the] - 4 distinct items - added into a HyperLogLog NewHLL(4), whose registers become [0,0,0,0,0,2,0,0,0,0,0,0,1,1,0,2]'
    - kw: When
      text: 'the distinct count is estimated'
    - kw: Then
      text: 'with 12 empty registers the small-range correction gives about 4.60, close to the true distinct count of 4'
    - kw: And
      text: 'over the one stream the Bloom filter reports no false negatives, the Count-Min sketch estimates cat 3 and the 4 without ever reading low, and HyperLogLog estimates about 4 distinct - three questions, three sketches, one stream'
code:
  lang: go
  source: |
    h := NewHLL(4)
    for _, tok := range stream { h.Add([]byte(tok)) }
    // registers == [0,0,0,0,0,2,0,0,0,0,0,0,1,1,0,2], 12 empty
    // Estimate() ~= 4.60 (linear counting), true distinct == 4
checkpoint: All three sketches answer the same stream correctly - the library is complete. Commit and stop here.
---

The last sketch answers **cardinality**. Feeding the stream to a `HyperLogLog` fills just four registers - one per distinct word - and leaves twelve empty. That sparse state triggers the small-range correction, and linear counting reads the twelve empties as about `4.60` distinct items, a close call on the true `4` even at this tiny `16`-register size.

Step back and the whole library is in view. One stream, three questions, three space-efficient answers: the **Bloom filter** never forgets a member and only ever risks a false positive; the **Count-Min sketch** estimates every frequency without ever under-counting; and **HyperLogLog** counts the distinct items from a handful of bytes. Every bit, counter, and register along the way was pinned to an exact value, because the hash functions were specified rather than borrowed - so the library you built is reproducible in any language. From a bit array and a pair of hashes, you have built the honest core of the probabilistic data structures that power real databases, caches, and stream processors. That is the whole toolkit, and it is yours.
