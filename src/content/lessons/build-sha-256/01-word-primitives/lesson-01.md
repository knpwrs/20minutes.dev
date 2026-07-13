---
project: build-sha-256
lesson: 1
title: Addition modulo 2^32
overview: SHA-256 does all of its arithmetic on 32-bit words that wrap around instead of overflowing. Today you build the one operation the whole algorithm leans on - adding two words modulo 2^32 - and pin what happens exactly at the wrap boundary.
goal: Add two 32-bit words so the result always stays within 32 bits, wrapping past the top.
spec:
  scenario: Word addition wraps at 2^32
  status: failing
  lines:
    - kw: Given
      text: 'two 32-bit words, treated as unsigned values in the range 0 to 0xffffffff'
    - kw: When
      text: 'they are added modulo 2^32'
    - kw: Then
      text: 'Add32(0xffffffff, 0x00000001) is 0x00000000 (it wraps to zero, it does not become 0x100000000)'
    - kw: And
      text: 'Add32(0x12345678, 0x11111111) is 0x23456789 and Add32(0x90000000, 0x90000000) is 0x20000000'
code:
  lang: go
  source: |
    // keep everything inside 32 bits; the top carry bit is discarded
    func Add32(a, b uint32) uint32 {
      // a uint32 already wraps on overflow in Go; other languages
      // may need an explicit & 0xffffffff after the add
      return a + b
    }
checkpoint: You can add two words with SHA-256's wrap-around arithmetic. Commit and stop here.
---

Every number SHA-256 touches is a **32-bit word**, and every addition it does is
**modulo 2^32** - the result is kept to its low 32 bits and any carry out of the
top is thrown away. This is not an accident of implementation; the standard
defines it this way, so `0xffffffff + 1` is `0`, not `0x100000000`. Getting this
one rule right is what makes every later intermediate value come out to the exact
number the standard predicts.

If your language has fixed-width unsigned 32-bit integers this wrapping is free.
If it does not (many do not - they use arbitrary-precision or 64-bit floats), you
must mask the result with `& 0xffffffff` after each add, or the carry leaks
upward and every downstream value drifts. Pin the boundary now: adding at the very
top (`0xffffffff + 1`) must land back at `0`, and two large words that together
exceed `2^32` keep only the low 32 bits.
