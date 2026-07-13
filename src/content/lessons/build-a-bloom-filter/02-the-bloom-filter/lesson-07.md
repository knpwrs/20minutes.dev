---
project: build-a-bloom-filter
lesson: 7
title: Contains, all bits set
overview: Membership is the read path. An item is reported possibly present only when every one of its k bits is set; a single clear bit is a definite no. Today you implement Contains.
goal: Return true only when all k of an item's bits are set, and false otherwise.
spec:
  scenario: Membership requires every one of the k bits
  status: failing
  lines:
    - kw: Given
      text: 'a Bloom filter NewBloom(32, 3) after adding "cat"'
    - kw: When
      text: 'membership is queried'
    - kw: Then
      text: 'Contains("cat") is true because bits 7, 21, and 30 are all set'
    - kw: And
      text: 'Contains("dog") is false because its bits 9, 10, and 11 are not all set'
code:
  lang: go
  source: |
    func (f *Bloom) Contains(data []byte) bool {
      // return false as soon as any of the k bits is clear
      // return true only if every one is set
    }
checkpoint: Your Bloom filter answers membership by checking all k bits. Commit and stop here.
---

`Contains` mirrors `Add`: compute the same `k` indices and check the bits, but read instead of write. The rule is strict - the item is possibly present only if **every** one of its `k` bits is set. The moment you find a clear bit you can stop and answer no, because if the item had ever been added, `Add` would have set that bit.

That asymmetry is the heart of a Bloom filter. A "yes" is a **maybe** - the bits could all be set by other items that happened to overlap - but a "no" is **certain**. `"dog"` here is genuinely absent, and at least one of its bits is clear, so the filter correctly rejects it. The next lesson makes both halves of that guarantee explicit.
