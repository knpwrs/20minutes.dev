---
project: build-a-json-parser
lesson: 24
title: Serializing scalars
overview: A parser that cannot write JSON back out is only half a library. Today you start the serializer with the scalars - null, booleans, and numbers - and settle how numbers are formatted.
goal: Serialize null, boolean, and number values to their compact JSON text.
spec:
  scenario: Writing scalar values as text
  status: failing
  lines:
    - kw: Given
      text: 'a scalar Value'
    - kw: When
      text: 'Serialize is called'
    - kw: Then
      text: 'Null is "null", Bool true is "true", Bool false is "false", Number 42 is "42", and Number 3.5 is "3.5"'
    - kw: And
      text: 'Number 0.5 is "0.5", Number -7 is "-7", Number 1000000 is "1000000" (no exponent), and Number negative zero is "0"'
code:
  lang: go
  source: |
    // Serialize(v Value) string, dispatched on v.Kind
    //   Null -> "null"; Bool -> "true"/"false"
    //   Number: shortest decimal with no exponent, integers without a dot
    //     if v.Num == 0 { return "0" }            // folds -0 to 0
    //     return strconv.FormatFloat(v.Num, 'f', -1, 64)
checkpoint: Scalars serialize to compact JSON text. Commit and stop here.
---

Serialization is parsing in reverse: turn a `Value` back into JSON text. Start where
parsing started, at the scalars. `Null` writes as `null`, and the booleans as `true`
and `false` - trivial. The interesting one is **number formatting**, because a
`float64` can be printed many ways and JSON wants a clean, minimal form.

The rule here is: the **shortest decimal** that round-trips to the same value, with
integer-valued numbers written without a fractional part and without an exponent. So
`42` prints as `42`, not `42.0` or `4.2e1`, and `1000000` prints in full rather than
`1e+06`. Fold **negative zero** to `0` on output - it is a distinct value but writing
it as `-0` surprises readers and most other libraries emit `0`. One small caveat this
introduces: since numbers are IEEE-754 doubles, an integer too large to represent
exactly will not round-trip perfectly, which the caveats will note. Strings, with
their escaping, come next.
