---
project: build-a-bignum-library
lesson: 15
title: Schoolbook long multiplication
overview: Now the full product - every limb of one number times every limb of the other, accumulated into the right place with carries. This is the O(n times m) algorithm that just works, at any size.
goal: Multiply two magnitudes with schoolbook long multiplication, accumulating partial products with carry.
spec:
  scenario: Long multiplication accumulates shifted partial products
  status: failing
  lines:
    - kw: Given
      text: 'the magnitudes of 1000000000 and 1000000000'
    - kw: When
      text: 'they are multiplied'
    - kw: Then
      text: 'the result renders as "1000000000000000000"'
    - kw: And
      text: 'the magnitudes of 10000000001 and 10000000001 multiply to render as "100000000020000000001"'
code:
  lang: go
  source: |
    func mulMag(a, b mag) mag {
      if len(a) == 0 || len(b) == 0 { return nil }
      out := make(mag, len(a)+len(b)) // enough room for the product
      for i := range a {
        var carry uint64
        for j := range b {
          // add a[i]*b[j] into out[i+j], plus what is already there and carry
          cur := uint64(out[i+j]) + uint64(a[i])*uint64(b[j]) + carry
          out[i+j] = uint32(cur % Base)
          carry = cur / Base
        }
        out[i+len(b)] += uint32(carry)
      }
      return out.normalize()
    }
checkpoint: Two magnitudes multiply at any size. Commit and stop here.
---

Long multiplication places the product of limb `i` of `a` and limb `j` of `b` into
position `i + j` of the result, exactly as decimal long multiplication shifts each
partial product left. The trick that keeps the numbers small is to **accumulate as
you go**: rather than form each full partial product and add them at the end, add
`a[i] * b[j]` straight into `out[i+j]` along with whatever is already sitting there
and the carry. That running cell stays below roughly `10^18 + 2 * 10^9`, still inside
64 bits, so a carry is propagated every single step and never allowed to pile up.

Sizing the output at `len(a) + len(b)` limbs guarantees room for the largest possible
product; `normalize` trims the one leading zero limb when the true product is a limb
shorter. This is quadratic in the number of limbs - slow for very large inputs, which
is exactly what Karatsuba will fix in a few lessons - but it is correct at every size
and is the reference every faster method gets checked against.
