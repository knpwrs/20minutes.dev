---
project: build-a-bignum-library
lesson: 6
title: Rendering a magnitude to decimal
overview: Reading decimal in, we now write it back out. The catch is padding - every limb except the most significant must print as exactly nine digits, or the digits shift. Today you render a magnitude to its decimal string.
goal: Render a magnitude to decimal with the top limb unpadded and every lower limb zero-padded to nine digits.
spec:
  scenario: Lower limbs pad to nine digits so interior zeros survive
  status: failing
  lines:
    - kw: Given
      text: 'a magnitude with limbs (1, 0, 1) from least significant to most'
    - kw: When
      text: 'it is rendered to decimal'
    - kw: Then
      text: 'it is "1000000000000000001" (the middle zero limb prints as nine zeros)'
    - kw: And
      text: 'the magnitude with limbs (0, 1) renders as "1000000000", and the empty magnitude renders as "0"'
code:
  lang: go
  source: |
    // most-significant limb plain; every lower limb padded to 9 digits
    func (m mag) String() string {
      if len(m) == 0 { return "0" }
      s := strconv.Itoa(int(m[len(m)-1]))
      for i := len(m) - 2; i >= 0; i-- {
        s += fmt.Sprintf("%09d", m[i]) // zero-pad to nine
      }
      return s
    }
checkpoint: A magnitude renders back to its exact decimal string. Commit and stop here.
---

Rendering is grouping in reverse: print the limbs from most significant to least
and concatenate. The trap is that a limb like `5` means the digits `000000005`
everywhere **except** at the very top of the number. So the most-significant limb
prints plainly (no leading zeros), and every limb below it is **zero-padded to
exactly nine digits**. Miss the padding and `(1, 0, 1)` would print as `"101"`
instead of `"1000000000000000001"` - the interior zero limb would vanish and every
digit above it would slide nine places.

Empty magnitude is the base case: it renders as `"0"`. With this and the parser you
have a complete magnitude round-trip; next lesson adds the sign and confirms the
whole loop closes on some genuinely large numbers.
