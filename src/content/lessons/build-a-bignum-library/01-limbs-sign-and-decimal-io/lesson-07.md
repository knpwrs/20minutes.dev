---
project: build-a-bignum-library
lesson: 7
title: 'String and the round-trip'
overview: The first chapter closes by joining sign and magnitude into the public String, then proving parse and render are exact inverses on genuinely large numbers - the first thing this library can really do.
goal: Render a BigInt with its sign and confirm Parse and String round-trip exactly.
spec:
  scenario: Parse and String are exact inverses, sign included
  status: failing
  lines:
    - kw: Given
      text: 'the decimal string "18446744073709551616" (two to the sixty-fourth)'
    - kw: When
      text: 'it is parsed and rendered back with String()'
    - kw: Then
      text: 'the result is exactly "18446744073709551616"'
    - kw: And
      text: 'Parse("-18446744073709551616").String() is "-18446744073709551616", NewFromInt64(0).String() and Parse("-0").String() are both "0", and Parse("007").String() is "7"'
code:
  lang: go
  source: |
    func (x BigInt) String() string {
      if x.sign == 0 { return "0" }
      s := x.mag.String()
      if x.sign < 0 { return "-" + s }
      return s
    }
checkpoint: The library reads and writes signed big decimals exactly. Commit and stop here.
---

`String` is the small cap on the chapter: for zero return `"0"`, otherwise render
the magnitude and prepend a `-` when the sign is negative. Because zero is
canonical, there is no negative-zero branch to worry about - `Parse("-0")` already
carries sign `0`, so it prints `"0"`.

The real point of today is the **round-trip**. `Parse` and `String` should be exact
inverses on the canonical form: parse a string, render it, and get back the same
digits (minus any leading zeros or a spurious minus). Two to the sixty-fourth,
`18446744073709551616`, is far past what a 64-bit integer can hold, yet it survives
the loop limb for limb. That closed loop - exact in, exact out, at arbitrary size -
is the foundation every arithmetic operation from here will be checked against.
