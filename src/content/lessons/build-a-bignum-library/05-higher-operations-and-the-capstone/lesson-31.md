---
project: build-a-bignum-library
lesson: 31
title: Parsing hexadecimal
overview: Reading hex in is the inverse of writing it out - fold each digit into a running total, multiplying by sixteen as you go. Today you add ParseHex and confirm hex round-trips.
goal: Parse a hexadecimal string into a BigInt by folding digits, with an optional sign and rejection of bad input.
spec:
  scenario: Hex parsing folds digits with a times-sixteen accumulator
  status: failing
  lines:
    - kw: Given
      text: 'the hex string "ff"'
    - kw: When
      text: 'ParseHex is evaluated'
    - kw: Then
      text: 'the result is 255'
    - kw: And
      text: 'ParseHex("10000000000000000") is 18446744073709551616, ParseHex("-ff") is -255, and ParseHex("zz") returns an error'
code:
  lang: go
  source: |
    func ParseHex(s string) (BigInt, error) {
      neg := false
      if len(s) > 0 && s[0] == '-' { neg = true; s = s[1:] }
      acc := NewFromInt64(0)
      sixteen := NewFromInt64(16)
      for i := 0; i < len(s); i++ {
        d := hexVal(s[i]) // 0..15, or an error for a non-hex byte
        acc = Add(Mul(acc, sixteen), NewFromInt64(int64(d)))
      }
      // apply neg, reject empty; return acc
    }
checkpoint: BigInts parse from hexadecimal and round-trip through Hex. Commit and stop here.
---

Parsing any base is a fold: start at zero and, for each digit left to right, multiply
the running total by the base and add the digit's value. For hex the base is `16` and
each digit is `0` through `15`, with `a` through `f` mapping to `10` through `15`. An
optional leading `-` sets the sign, an empty body or any non-hex character is an
error, and everything else is built from `Mul` and `Add` you already have.

The satisfying check is the **round trip**: parse a hex string, render it back with
`Hex`, and get the same digits - and the same the other way, `ParseHex(x.Hex()) == x`.
`"ff"` is `255`, `"10000000000000000"` is `2^64`. With decimal and hexadecimal
conversion both closing their loops, every public operation the library needs is in
place. Only the capstone remains.
