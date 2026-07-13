---
project: build-sha-256
lesson: 3
title: Shift right (SHR) versus ROTR
overview: The other bit-move SHA-256 needs is a plain right shift that fills the top with zeros instead of wrapping. Today you build SHR and pin how it differs from ROTR on the very same word - the wrap-around bit is the whole difference.
goal: Shift a word right by n bits, filling the vacated high bits with zeros.
spec:
  scenario: Shifting right discards the low bits instead of wrapping them
  status: failing
  lines:
    - kw: Given
      text: 'a 32-bit word and a shift amount n between 1 and 31'
    - kw: When
      text: 'SHR(x, n) shifts it right, filling the top n bits with zero'
    - kw: Then
      text: 'SHR(0x12345678, 4) is 0x01234567, while ROTR(0x12345678, 4) is 0x81234567 (same word, same n, different result)'
    - kw: And
      text: 'SHR(0x00000001, 1) is 0x00000000 (the low bit is discarded), while ROTR(0x00000001, 1) is 0x80000000 (it wraps)'
code:
  lang: go
  source: |
    // no wrap-around: the low bits just fall off and the top fills with 0
    func SHR(x uint32, n int) uint32 {
      return x >> n
    }
checkpoint: You can shift a word right with zero fill, and you have pinned how it differs from ROTR. Commit and stop here.
---

**SHR** is the simpler cousin of ROTR: a logical right shift by `n` that fills the
top `n` bits with zeros and lets the low bits simply fall off the end. The
contrast is the point of today. Feed both `ROTR` and `SHR` the same word
`0x12345678` and the same `n = 4` and they disagree: SHR gives `0x01234567` (the
low nibble is gone, a `0` leads), while ROTR gives `0x81234567` (the low nibble
wrapped up to the top). That single wrapped nibble is the *entire* difference
between the two operations.

The distinction matters because the sigma functions you build in two lessons mix
both: the big sigma functions use only rotations, while the small sigma functions
use rotations *and* a shift, and swapping one for the other silently corrupts
every message-schedule word. Pin the extreme case too: `SHR(0x00000001, 1)` is
`0`, because the only set bit drops off the bottom, whereas the same input under
ROTR wraps that bit to `0x80000000`.
