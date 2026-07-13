---
project: build-sha-256
lesson: 2
title: Rotate right (ROTR)
overview: SHA-256 mixes bits by rotating words - shifting them right while the bits that fall off the low end wrap back around to the high end. Today you build ROTR and pin the wrap-around bit exactly.
goal: Rotate a 32-bit word right by n bits so the low bits reappear at the top.
spec:
  scenario: Rotating right wraps low bits to the top
  status: failing
  lines:
    - kw: Given
      text: 'a 32-bit word and a rotation amount n between 1 and 31'
    - kw: When
      text: 'ROTR(x, n) rotates it right, bits shifted off the low end reappearing at the high end'
    - kw: Then
      text: 'ROTR(0x12345678, 4) is 0x81234567 (the low nibble 0x8 wraps to the top)'
    - kw: And
      text: 'ROTR(0x00000001, 1) is 0x80000000 (the single low bit wraps to bit 31) and ROTR(0x12345678, 8) is 0x78123456'
code:
  lang: go
  source: |
    // right part is x >> n; the bits that fall off come back on the left
    func ROTR(x uint32, n int) uint32 {
      // combine (x >> n) with (x << (32 - n)), both kept to 32 bits
      // (fill in)
      return 0
    }
checkpoint: You can rotate a word right with wrap-around. Commit and stop here.
---

**Rotation** is the workhorse of SHA-256's bit mixing. A right rotation by `n`
slides every bit down by `n` places, but unlike a plain shift the `n` bits that
fall off the bottom are not lost - they wrap around and reappear at the top. So
rotating `0x12345678` right by 4 does not just shift the hex digits, it carries
the low nibble `8` all the way around to become the leading `0x8...`, giving
`0x81234567`.

The clean way to build it from shifts: the surviving high part is `x >> n`, and
the wrapped low part is `x << (32 - n)`; OR them together and keep the result to
32 bits. Pin the wrap explicitly - `ROTR(0x00000001, 1)` must be `0x80000000`,
because the lone bit at position 0 rotates around to position 31. If your language
lacks 32-bit ints, mask the left-shift with `& 0xffffffff` or the wrapped bits
land above bit 31 and vanish.
