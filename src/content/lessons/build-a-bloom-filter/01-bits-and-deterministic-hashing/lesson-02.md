---
project: build-a-bloom-filter
lesson: 2
title: Counting and clearing bits
overview: To measure how full a filter is and to reuse it, the bit array needs two more operations. Today you add Count, which reports how many bits are set, and Reset, which wipes the array clean.
goal: Report how many bits are currently set, and clear the whole array back to empty.
spec:
  scenario: A bit array counts its set bits and clears them
  status: failing
  lines:
    - kw: Given
      text: 'a 16-bit array with bits 3, 7, and 15 set'
    - kw: When
      text: 'Count is queried'
    - kw: Then
      text: 'it returns 3'
    - kw: And
      text: 'after Reset, Count returns 0 and Get(3) is false'
code:
  lang: go
  source: |
    // sum the set bits across every word; many languages have a popcount
    func (b *Bits) Count() int {
      n := 0
      for _, w := range b.words { n += bits.OnesCount64(w) }
      return n
    }
    func (b *Bits) Reset() { /* set every word back to 0 */ }
checkpoint: Your bit array can report how many bits are set and clear itself. Commit and stop here.
---

Two small operations round out the bit array. **Count** tells you how many bits are set, which later reports how loaded a filter has become - a filter whose bits are nearly all set is close to useless because almost everything looks present. **Reset** returns the array to empty so a fresh run starts clean.

Counting set bits is a **population count** (popcount): tally the one-bits in each word and sum them. It is the same idea whether your language offers a built-in popcount or you loop over the bits by hand. Both operations touch the whole array, so they are naturally O(number of words) - fine, because this is bookkeeping, not the hot path.
