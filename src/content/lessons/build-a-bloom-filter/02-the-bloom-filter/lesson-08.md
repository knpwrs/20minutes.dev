---
project: build-a-bloom-filter
lesson: 8
title: No false negatives
overview: The Bloom filter's defining guarantee is one-sided. Anything you added always reads present, and a single clear bit proves an item was never added. Today you pin both directions of that promise.
goal: Show that every added item reports present, and that one clear bit means definitely absent.
spec:
  scenario: Added items always present; a clear bit proves absence
  status: failing
  lines:
    - kw: Given
      text: 'a Bloom filter NewBloom(32, 3) after adding "cat", "dog", and "the"'
    - kw: When
      text: 'each added item is queried and then "fox" is queried'
    - kw: Then
      text: 'Contains is true for "cat", "dog", and "the" - there are no false negatives'
    - kw: And
      text: '"fox" reports false because its bit at index 14 is clear, so it was definitely never added'
code:
  lang: go
  source: |
    // no code beyond Add/Contains is needed - this pins the guarantee.
    // After adding cat, dog, the: bits {2,7,9,10,11,15,21,28,30} are set.
    // fox hashes to {14,27,8}; index 14 is clear -> definitely absent.
checkpoint: You have shown the filter never denies a member and only rejects true non-members. Commit and stop here.
---

This lesson has almost no new code; its job is to nail down the guarantee that makes Bloom filters trustworthy. Because `Add` only ever **sets** bits and never clears them, any item you added has all `k` of its bits set forever after. So `Contains` on a member can never return false: there are **no false negatives**. Whatever else a Bloom filter gets wrong, it never forgets something it was told.

The other direction is just as firm. When `Contains` returns false, it found a bit that no `Add` ever set, which is only possible if the item was never added - a false answer is always **definite absence**. `"fox"` lands on a bit that none of `"cat"`, `"dog"`, or `"the"` touched, so the filter rejects it with certainty. The one thing the filter can get wrong is the opposite case - a non-member whose bits happen to all be set - and that false positive is what the rest of the chapter measures and then deliberately provokes.
