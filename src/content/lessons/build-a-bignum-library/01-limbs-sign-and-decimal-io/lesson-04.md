---
project: build-a-bignum-library
lesson: 4
title: Parsing a decimal magnitude
overview: Base 1000000000 was chosen for exactly this moment - nine decimal digits are one limb, so parsing a decimal string means slicing it into nine-digit groups from the right. Today you turn a run of digits into a magnitude.
goal: Parse a string of decimal digits into a magnitude by grouping nine digits per limb from the right.
spec:
  scenario: A decimal string groups into limbs nine digits at a time from the right
  status: failing
  lines:
    - kw: Given
      text: 'the decimal string "12345678901234567890"'
    - kw: When
      text: 'it is parsed into a magnitude'
    - kw: Then
      text: 'it has 3 limbs: limb 0 is 234567890, limb 1 is 345678901, and limb 2 is 12'
    - kw: And
      text: 'the string "5" parses to one limb of value 5, and "1000000000" parses to limbs (0, 1)'
code:
  lang: go
  source: |
    // walk the string from the right in chunks of nine digits
    func parseMag(s string) mag {
      var m mag
      for len(s) > 0 {
        cut := len(s) - 9
        if cut < 0 { cut = 0 }
        limb := atoiUint(s[cut:]) // parse this <=9 digit chunk
        m = append(m, uint32(limb))
        s = s[:cut]
      }
      return m.normalize()
    }
checkpoint: A decimal string becomes a magnitude by nine-digit grouping. Commit and stop here.
---

Here is the payoff of base **1000000000**: a limb holds a number from `0` to
`999999999`, which is precisely the range of a nine-digit decimal group. So to
parse a decimal string you do not need any multiplication at all - you cut the
string into nine-digit pieces **from the right**, and each piece, read as an
ordinary integer, is one limb. The rightmost nine digits are limb 0, the next nine
are limb 1, and a short leftover chunk (here `12`) is the top limb.

The only subtlety is the leftmost chunk, which may be shorter than nine digits, so
your cut has to clamp at the start of the string. Run the result through
`normalize` so a string like `"000000000"` collapses to the empty magnitude. Signs
and bad input are the next lesson; today assume the string is a clean run of
digits.
