---
project: build-a-bignum-library
lesson: 5
title: Parsing sign and rejecting bad input
overview: A real parser handles a leading minus, collapses a negative zero, and refuses garbage. Today you wrap the magnitude parser into the public Parse and pin its edges.
goal: Parse an optional leading minus and digits into a BigInt, rejecting invalid input and canonicalizing "-0".
spec:
  scenario: Parse handles sign, leading zeros, negative zero, and invalid input
  status: failing
  lines:
    - kw: Given
      text: 'the string "-123"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'it succeeds with Sign() -1 and a magnitude of one limb equal to 123'
    - kw: And
      text: 'Parse("-0") succeeds with Sign() 0 and an empty magnitude, Parse("007") succeeds with Sign() 1 and limb 7, and Parse("") and Parse("12x") each return an error'
code:
  lang: go
  source: |
    func Parse(s string) (BigInt, error) {
      neg := false
      if len(s) > 0 && s[0] == '-' { neg = true; s = s[1:] }
      // reject empty body or any non-digit rune here
      m := parseMag(s)
      sign := 1
      if len(m) == 0 { sign = 0 } else if neg { sign = -1 }
      return BigInt{sign, m}, nil
    }
checkpoint: Parse reads signed decimal input and rejects garbage. Commit and stop here.
---

`parseMag` trusts its input; `Parse` does not. It peels an optional leading `-`,
then requires that what remains is a non-empty run of decimal digits - an empty
string, a lone `-`, or anything with a non-digit character is an **error**, not a
zero. Leading zeros are fine (`"007"` is `7`), because grouping and normalization
handle them for free.

The one rule to hold onto is the **canonical zero** from lesson 3: if the parsed
magnitude is empty, the sign must be `0` regardless of a leading minus, so `"-0"`
parses to the same value as `"0"`. Wire that check in here and negative zero can
never enter the system through the front door.
