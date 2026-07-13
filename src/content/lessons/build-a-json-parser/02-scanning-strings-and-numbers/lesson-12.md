---
project: build-a-json-parser
lesson: 12
title: Fractions and exponents
overview: The full number grammar adds an optional fraction and an optional exponent to the integer part. Today you scan those, completing the Number token and rejecting the malformed forms.
goal: Scan the optional fraction and exponent of a number, rejecting a dot or exponent with no digits.
spec:
  scenario: Reading fractional and exponential numbers
  status: failing
  lines:
    - kw: Given
      text: 'a number with a fraction and/or an exponent'
    - kw: When
      text: it is scanned
    - kw: Then
      text: '"3.14" is Number 3.14, "1e3" is Number 1000, "-2.5E-2" is Number -0.025, and "1E+2" is Number 100'
    - kw: And
      text: '"1." is Illegal (fraction needs a digit), "1e" is Illegal (exponent needs a digit), and "1.e3" is Illegal'
code:
  lang: go
  source: |
    // after the integer part, optionally:
    //   fraction: '.' then ONE OR MORE digits (a bare '.' is Illegal)
    //   exponent: 'e' or 'E', optional '+' or '-', then ONE OR MORE digits
    // then parse the whole matched lexeme with a float parser
    //   ("3.14", "1e3", "-2.5E-2" all round-trip through it)
checkpoint: The scanner reads the full JSON number grammar into Number tokens. Commit and stop here.
---

The integer part is only the start of a number. After it may come a **fraction** -
a dot followed by one or more digits - and then an **exponent** - an `e` or `E`, an
optional sign, and one or more digits. `3.14` has a fraction; `1e3` is `1000`
through its exponent; `-2.5E-2` uses both and comes out to `-0.025`. Uppercase and
lowercase `E` are equivalent, and the exponent's sign may be `+`, `-`, or omitted.

The failing edges all come from **missing digits**. A dot must be followed by at
least one digit, so `1.` is malformed. An exponent marker must be followed by at
least one digit, so `1e` is malformed. And a fraction cannot be empty even before an
exponent, so `1.e3` is malformed too. Once the full lexeme is matched, hand it to a
floating-point parser to get the `Num` value; the grammar you enforced guarantees
the text it sees is well-formed. That completes every token kind - the scanner is
done, and parsing begins next.
