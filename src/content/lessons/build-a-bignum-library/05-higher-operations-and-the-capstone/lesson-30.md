---
project: build-a-bignum-library
lesson: 30
title: Rendering to hexadecimal
overview: Decimal is not the only base worth reading. Hexadecimal output is just repeated division by sixteen, collecting remainders - a direct use of the short division you built. Today you add Hex.
goal: Render a BigInt as a lowercase hexadecimal string via repeated division by sixteen.
spec:
  scenario: Hex output collects base-sixteen remainders
  status: failing
  lines:
    - kw: Given
      text: 'the BigInt 255'
    - kw: When
      text: 'Hex is evaluated'
    - kw: Then
      text: 'the result is "ff"'
    - kw: And
      text: 'Hex(4096) is "1000", Hex(18446744073709551616) is "10000000000000000", Hex(0) is "0", and Hex(-255) is "-ff"'
code:
  lang: go
  source: |
    const hexDigits = "0123456789abcdef"
    func (x BigInt) Hex() string {
      if x.sign == 0 { return "0" }
      m := x.mag
      var out []byte
      for len(m) > 0 {
        var d uint32
        m, d = divScalar(m, 16)      // remainder is the next hex digit
        out = append(out, hexDigits[d])
      }
      // reverse out, prepend '-' when negative
    }
checkpoint: BigInts render to hexadecimal. Commit and stop here.
---

Converting to another base is repeated division by that base, reading the remainders
off from least significant to most. For hex, divide the magnitude by `16` over and
over; each remainder is a value from `0` to `15`, one hexadecimal digit. Because the
digits come out lowest first, you reverse the collected string at the end, then
prepend a `-` if the number is negative and print `"0"` for zero.

This reuses `divScalar` unchanged - `16` is a perfectly ordinary single-limb divisor -
which is why building division early pays off now. `255` is `"ff"`, `4096` is
`"1000"`, and `2^64` is `1` followed by sixteen zeros, exactly the fixed-width hex you
would expect but with no width limit. Parsing hex back in is the inverse, and the last
new operation before the capstone.
