---
project: build-a-qr-code-encoder
lesson: 5
title: The log table
overview: 'The antilog table turns an exponent into an element; the log table is its inverse, turning an element back into its exponent. Together they are the two halves of fast multiplication. Today you invert the table you just built.'
goal: 'Build the inverse of the antilog table and read back its key entries.'
spec:
  scenario: 'The log table inverts the antilog table'
  status: failing
  lines:
    - kw: Given
      text: 'the antilog table exp, and a log table defined so that log[exp[i]] = i for every i from 0 to 254'
    - kw: When
      text: 'entries for 1, 2, 4, and 3 are read'
    - kw: Then
      text: 'log[1] is 0, log[2] is 1, and log[4] is 2 - the exponents that produce those powers'
    - kw: And
      text: 'log[3] is 25 and log[255] is 175; log[0] is left undefined because 0 is not a power of 2'
code:
  lang: go
  source: |
    // Invert exp: if exp[i] == v then log[v] == i. Element 0 has
    // no logarithm (it is never a power of 2), so leave it unset.
    var logt [256]byte
    func init() {
      for i := 0; i < 255; i++ {
        logt[exp[i]] = byte(i)
      }
    }
checkpoint: 'You have the log table mapping an element to its exponent. Commit and stop here.'
---

If the antilog table is "give me `2` to the power `i`", the **log table** answers the reverse question: "what power of `2` is this element?" You build it by walking `exp` and writing the inverse mapping - for each index `i`, the value `exp[i]` has logarithm `i`. Because `2` is primitive, every non-zero element appears exactly once, so the inverse is well defined for all 255 of them.

The one hole is `0`: it is never a power of `2`, so it has **no logarithm** and its entry is meaningless. Keep that firmly in mind, because the fast multiply you write next adds two logarithms - and it must special-case a zero operand rather than read `log[0]`. With both tables in hand, `log[3]=25` and `exp[25]=3` are two views of the same fact, and multiplication is about to become a single addition of exponents.
