---
project: build-a-bignum-library
lesson: 20
title: Dividing by a single limb
overview: Division is the hardest operation, so we start with the easy half - dividing a whole magnitude by one small limb. Today you build short division, walking the limbs from the top with a running remainder.
goal: Divide a magnitude by a single limb, producing a quotient and a remainder, top limb first.
spec:
  scenario: Short division carries a remainder from the top limb down
  status: failing
  lines:
    - kw: Given
      text: 'the magnitude of 1000000000000000000 and the single limb 7'
    - kw: When
      text: 'it is divided'
    - kw: Then
      text: 'the quotient is the magnitude of 142857142857142857 and the remainder is 1'
    - kw: And
      text: 'the magnitude of 100 divided by 7 gives quotient 14 and remainder 2'
code:
  lang: go
  source: |
    func divScalar(a mag, s uint32) (q mag, r uint32) {
      q = make(mag, len(a))
      var rem uint64
      for i := len(a) - 1; i >= 0; i-- { // top limb first
        cur := rem*Base + uint64(a[i]) // fits in 64 bits
        q[i] = uint32(cur / uint64(s))
        rem = cur % uint64(s)
      }
      return q.normalize(), uint32(rem)
    }
checkpoint: A magnitude divides by a single limb with a remainder. Commit and stop here.
---

Short division is long division you already do by hand: start at the most
significant limb, and at each step form a two-part number from the leftover
**remainder** and the current limb, divide it by the small divisor to get this
quotient limb, and carry the new remainder down to the next limb. Because the
remainder is always below the divisor (below `10^9`), `remainder * Base + limb`
stays under `10^18 + 10^9`, safely inside a 64-bit accumulator.

Note we walk the limbs from the **top** down, the opposite direction from addition
and multiplication, because in division the high-order digits are resolved first.
This handles any single-limb divisor exactly, which is enough to give the general
`DivMod` its easy path next lesson - and to power hexadecimal output later, which is
nothing but repeated division by sixteen.
