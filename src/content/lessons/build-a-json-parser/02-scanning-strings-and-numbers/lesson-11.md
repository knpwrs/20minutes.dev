---
project: build-a-json-parser
lesson: 11
title: Scanning an integer
overview: Numbers are the last token kind, and JSON's number grammar is stricter than most languages. Today you scan the integer part - an optional minus, then digits with no leading zeros - and pin the negative-zero and leading-zero edges.
goal: Scan a signed integer into a Number token, rejecting a leading zero.
spec:
  scenario: Reading integer numbers
  status: failing
  lines:
    - kw: Given
      text: 'a run of digits, optionally preceded by a minus sign'
    - kw: When
      text: it is scanned
    - kw: Then
      text: '"0" is Number 0, "123" is Number 123, "-5" is Number -5, and "-0" is Number negative zero'
    - kw: And
      text: '"01" is an Illegal token (no leading zeros), and a lone "-" is Illegal'
code:
  lang: go
  source: |
    // add Number to Kind; give Token a Num float64 field
    // grammar for the integer part:
    //   optional '-'
    //   then either a single '0', OR a digit 1-9 followed by more digits
    // '0' followed by another digit is Illegal ("leading zero")
    // '-' with no digit after is Illegal
    // convert the matched text with a float parse; keep the sign of -0
checkpoint: Signed integers scan to Number tokens and leading zeros are rejected. Commit and stop here.
---

A JSON **number** starts with an optional minus sign and an integer part, and that
integer part has a surprising rule: it is either a single `0`, or a nonzero digit
followed by more digits. That means **no leading zeros** - `01` is not a valid
number, even though most languages would accept it. Enforcing this is what makes
`01` an error rather than the number `1` followed by junk.

Two edges are worth pinning now. First, `-0` is a valid number and it is **negative
zero** - a real IEEE-754 value distinct in sign from `0`, which you preserve by
parsing the signed text rather than special-casing it away. Second, a lone `-` with
no digit after it is not a number at all and is Illegal. Store the value as a
floating-point `Num` on the token, the same representation the value tree will use.
Fractions and exponents extend this integer part next.
