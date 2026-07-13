---
project: build-a-qr-code-encoder
lesson: 3
title: Multiplying two elements
overview: 'With doubling in hand you can multiply any two field elements the way you multiply by hand in binary: for each set bit of one operand, add in a doubled copy of the other. Today you build full GF(256) multiplication from the doubling step.'
goal: 'Multiply two field elements by adding shifted copies, reducing with the doubling step.'
spec:
  scenario: 'Multiplication combines doublings with XOR'
  status: failing
  lines:
    - kw: Given
      text: 'the doubling step xtime from the previous lesson'
    - kw: When
      text: 'gmul(3, 3) and gmul(76, 43) are called'
    - kw: Then
      text: 'gmul(3, 3) is 5 - because 3 times 3 is (2+1)(2+1), and in this field the cross terms XOR to give x^2 + 1 which is 5'
    - kw: And
      text: 'gmul(76, 43) is 251, and gmul(0, 200) is 0'
code:
  lang: go
  source: |
    // Long multiplication in GF(2): walk the bits of b. Whenever a
    // bit is set, XOR the running-doubled a into the result.
    func gmul(a, b byte) byte {
      var r byte = 0
      for b > 0 {
        if b&1 != 0 {
          r ^= a
        }
        a = xtime(a) // double a for the next bit position
        b >>= 1
      }
      return r
    }
checkpoint: 'You can multiply any two elements the slow, honest way. Commit and stop here.'
---

To multiply `a` by `b`, think of `b` in binary: `b = b0*1 + b1*2 + b2*4 + ...`. Then `a*b` is `a` times each of those powers of two, all **added together**. You already have doubling, so you can produce `a*1, a*2, a*4, ...` by repeatedly calling `xtime`, and "added together" means XOR. Walk the bits of `b` from the bottom: whenever a bit is set, XOR the current doubled `a` into the accumulator, then double `a` and move to the next bit. This is exactly binary long multiplication, with carries replaced by the field's reduce step.

`gmul(3, 3)` shows the flavour: `3` is `x + 1`, and `(x+1)(x+1)` is `x^2 + 2x + 1`, but `2x` is `x + x` which XORs to `0`, leaving `x^2 + 1`, which is `0b101` = `5`. This routine is correct but does a loop per multiply. Over the next three lessons you will replace it with a table lookup that is both faster and, once you trust it, easier to reason about - but keep this version, because it is the ground truth you will check the fast one against.
