---
project: build-a-bloom-filter
lesson: 13
title: Delete by decrement
overview: With counters in place, removal becomes possible. Deleting an item decrements its k counters, and an add followed by a delete leaves the filter exactly as it was before. Today you implement Delete and pin that round trip.
goal: Decrement the k counters on Delete so that an add-then-delete restores the prior state.
spec:
  scenario: Delete subtracts an item cleanly
  status: failing
  lines:
    - kw: Given
      text: 'a counting filter NewCounting(16, 3) after adding "cat" (indices 7, 14, 5) and "dog" (indices 9, 10, 11)'
    - kw: When
      text: '"cat" is deleted'
    - kw: Then
      text: 'counters 5, 7, and 14 return to 0 while 9, 10, and 11 stay at 1'
    - kw: And
      text: 'Contains("cat") is now false but Contains("dog") is still true'
code:
  lang: go
  source: |
    func (f *Counting) Delete(data []byte) {
      // decrement each of the k counters (guard against going below zero)
    }
checkpoint: Your counting filter can remove an item without disturbing others. Commit and stop here.
---

`Delete` is the mirror of `Add`: compute the item's `k` indices and **decrement** each counter instead of incrementing it. Because `"dog"` bumped a different set of slots than `"cat"`, removing `"cat"` drops only its three counters back to zero and leaves `"dog"` untouched - the exact behavior a plain bit array could not manage. The add-then-delete round trip returning to the original state is the property worth pinning: deletion is genuinely the inverse of insertion here.

One guard matters: never let a counter drop below zero. If a counter is already `0` a `Delete` should leave it there rather than wrap around to a huge value. Deleting an item that was never added is therefore harmless. The remaining rough edge is at the *top* of a counter's range, when many items pile onto the same slot - that overflow case is the next lesson.
