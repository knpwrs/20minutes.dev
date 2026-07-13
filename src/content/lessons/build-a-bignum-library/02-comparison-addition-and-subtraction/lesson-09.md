---
project: build-a-bignum-library
lesson: 9
title: Comparing signed integers
overview: A negative number is always below a positive one, and among negatives the bigger magnitude is the smaller number. Today you build the public Cmp on top of magnitude comparison.
goal: Compare two BigInts and return -1, 0, or 1, dispatching on sign then magnitude.
spec:
  scenario: Signed comparison dispatches on sign, then magnitude with a flip for negatives
  status: failing
  lines:
    - kw: Given
      text: 'the BigInts -5 and 3'
    - kw: When
      text: 'Cmp(-5, 3) is evaluated'
    - kw: Then
      text: 'it returns -1'
    - kw: And
      text: 'Cmp(-5, -3) is -1 (a bigger magnitude is a smaller negative), Cmp(3, 3) and Cmp(0, 0) are 0, and Cmp(5, -100) is 1'
code:
  lang: go
  source: |
    func Cmp(x, y BigInt) int {
      if x.sign != y.sign {
        if x.sign < y.sign { return -1 }
        return 1
      }
      if x.sign == 0 { return 0 }
      c := cmpMag(x.mag, y.mag)
      // when both are negative, a larger magnitude means a smaller value
      return c * x.sign
    }
checkpoint: BigInts order correctly across signs. Commit and stop here.
---

Sign dominates: if the two signs differ, the one with the larger sign value is
greater and you are done - no need to look at magnitudes. Two zeros (sign `0`) are
equal. When the signs are **equal and non-zero**, the magnitudes break the tie, but
with a twist for negatives: among negative numbers a **larger** magnitude is a
**smaller** value (`-5 < -3`).

The clean way to handle that twist is to compare magnitudes and multiply the result
by the shared sign: for two positives the magnitude order stands, and for two
negatives it flips, exactly as it should. That one multiply turns four cases into
one line and keeps the comparison total and consistent with the arithmetic you are
about to build.
