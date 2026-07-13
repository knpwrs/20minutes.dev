---
project: build-a-qr-code-encoder
lesson: 2
title: Multiply by two
overview: 'Multiplication in GF(256) is built up from one primitive move: doubling a value. Doubling can overflow a byte, and when it does you fold it back into the field by XOR-ing a fixed polynomial. Today you write that doubling step, the seed of all field multiplication.'
goal: 'Double a field element, reducing by 0x11D whenever the result would exceed a byte.'
spec:
  scenario: 'Doubling wraps back into the field'
  status: failing
  lines:
    - kw: Given
      text: 'the doubling operation xtime'
    - kw: When
      text: 'xtime(1), xtime(64), and xtime(128) are called'
    - kw: Then
      text: 'xtime(1) is 2 and xtime(64) is 128 - a plain left shift, since they fit in a byte'
    - kw: And
      text: 'xtime(128) is 0x1D (29), because 128 doubled is 256 which overflows, so the result is reduced by XOR-ing 0x11D (keeping the low 8 bits)'
code:
  lang: go
  source: |
    // Doubling is a left shift. If bit 7 was set, the shift
    // overflows past 8 bits, so fold it back by XOR-ing 0x11D.
    func xtime(a byte) byte {
      hi := a&0x80 != 0
      r := a << 1
      if hi {
        r ^= 0x1D // low 8 bits of 0x11D
      }
      return r
    }
checkpoint: 'You can double any element and keep it inside the field. Commit and stop here.'
---

Multiplication in GF(256) is repeated doubling, so the doubling step is the atom to get right. Doubling a byte is a **left shift by one**. For small values that is all there is: `1` doubles to `2`, `64` doubles to `128`. But `128 << 1` is `256`, which no longer fits in a byte - it has spilled out of the field.

To pull an overflow back in, GF(256) fixes an **irreducible polynomial**, and QR codes use `0x11D` (binary `1 0001 1101`). Whenever a double overflows past bit 7, you XOR the result with `0x11D`; because you only keep the low 8 bits, that is the same as XOR-ing `0x1D`. So `xtime(128)` is `0x1D`, which is `29`. This single fact - that `x^8` reduces to `0x1D` in this field - is the seed of every product you will compute, and it is why the tables you build next start `1, 2, 4, ... , 128, 29`.
