---
project: build-a-bloom-filter
lesson: 26
title: Membership over a stream
overview: The capstone runs one deterministic stream through all three sketches. First up is the Bloom filter, which over the whole stream must never deny a member and should exhibit at least one honest false positive.
goal: Feed a stream to a Bloom filter and confirm no false negatives plus a real false positive.
spec:
  scenario: The filter never denies a member and admits one false positive
  status: failing
  lines:
    - kw: Given
      text: 'the stream [cat, dog, the, cat, fox, the, cat, dog, the, the] added into a Bloom filter NewBloom(16, 3), which sets bits {2,5,7,8,9,10,11,12,14,15}'
    - kw: When
      text: 'membership is queried for every token in the stream and then for the never-added word "olive"'
    - kw: Then
      text: 'Contains is true for all four distinct tokens - cat, dog, the, and fox - so there are no false negatives'
    - kw: And
      text: 'Contains("olive") is also true - a false positive, because its bits 12, 2, and 8 were all set by the added tokens'
code:
  lang: go
  source: |
    f := NewBloom(16, 3)
    for _, tok := range stream { f.Add([]byte(tok)) }
    // every token in the stream: Contains == true (no false negatives)
    // "olive" was never added yet Contains("olive") == true (a false positive)
checkpoint: The Bloom filter answers membership over the stream with no false negatives. Commit and stop here.
---

The final chapter is a single stream - ten tokens over four distinct words - passed through every sketch you built, each answering its own question. The Bloom filter answers **membership**, and the capstone pins its guarantee end to end: after adding the whole stream, every token that appeared reads present. Not one member is denied, which is the no-false-negatives promise holding across a realistic run rather than a single hand-picked pair.

The deliberately small `16`-bit filter is crowded by four items, so it also delivers the other half of the bargain: `"olive"`, which never appeared in the stream, collides onto three already-set bits and reports present. That is a true **false positive**, exactly the behavior the sizing math predicts and the price you knowingly pay for a filter this small. Membership done; frequency is next.
