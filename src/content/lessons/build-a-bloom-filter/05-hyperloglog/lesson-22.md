---
project: build-a-bloom-filter
lesson: 22
title: Add keeps the maximum rank
overview: Each register remembers just one number - the largest rank ever seen among the items that landed in it. Adding an item updates its register only if the new rank beats the old. Today you implement Add.
goal: On Add, store the item's rank in its register only when it exceeds the current value.
spec:
  scenario: A register holds the maximum rank it has seen
  status: failing
  lines:
    - kw: Given
      text: 'a HyperLogLog NewHLL(4) with all registers zero'
    - kw: When
      text: '"the" (register 5, rank 2) is added, then "cherry" (register 5, rank 3), then "the" again'
    - kw: Then
      text: 'register 5 holds 3 - the maximum rank seen, not the latest and not a sum'
    - kw: And
      text: 'adding "the" (rank 2) once more leaves register 5 at 3'
code:
  lang: go
  source: |
    func (h *HLL) Add(data []byte) {
      x := Hash1(data)
      r := h.register(x)
      if rk := uint8(h.rank(x)); rk > h.registers[r] {
        h.registers[r] = rk
      }
    }
checkpoint: Your HyperLogLog records the maximum rank per register. Commit and stop here.
---

`Add` combines the two pieces: hash the item, pick its register from the high bits, compute the rank from the low bits, and keep it **only if it is larger** than what the register already holds. A register is therefore a running maximum - it forgets everything except the single rarest leading-zero pattern that has ever fallen into it.

That maximum is exactly the right thing to remember. A register's value never decreases, so adding the same item again (same hash, same rank) changes nothing - which is why HyperLogLog naturally counts **distinct** items and ignores repeats. Here `"cherry"` bumps register `5` from `2` up to `3`, and re-adding the lower-rank `"the"` cannot pull it back down. With the registers filled, the remaining job is to turn that grid of maxima into a single cardinality estimate.
