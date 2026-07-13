---
project: build-a-qr-code-encoder
lesson: 8
title: The generator polynomial
overview: 'Reed-Solomon encoding divides your message by a fixed generator polynomial whose roots are consecutive powers of 2. Today you build that generator for a chosen number of error-correction codewords by multiplying those root factors together.'
goal: 'Build the generator polynomial for n error-correction codewords as a product of root factors.'
spec:
  scenario: 'Generator is a product of (x + 2^i) factors'
  status: failing
  lines:
    - kw: Given
      text: 'the generator for n codewords defined as the product of (x - 2^i) for i from 0 to n-1, where minus equals plus in this field'
    - kw: When
      text: 'genPoly(2) and genPoly(7) are built by repeatedly multiplying by the next factor [1, 2^i]'
    - kw: Then
      text: 'genPoly(2) is [1, 3, 2] - the factors x+1 and x+2 from the previous lesson'
    - kw: And
      text: 'genPoly(7) is [1, 127, 122, 154, 164, 11, 68, 117], the 8 coefficients used for 7 error-correction codewords'
code:
  lang: go
  source: |
    // Start at the constant polynomial 1, then multiply in one
    // factor (x + 2^i) per step. exp[i] supplies 2^i.
    func genPoly(n int) []byte {
      g := []byte{1}
      for i := 0; i < n; i++ {
        g = polyMul(g, []byte{1, exp[i]})
      }
      return g
    }
checkpoint: 'You can build the generator polynomial for any codeword count. Commit and stop here.'
---

The generator is what gives Reed-Solomon its recovery power. For `n` error-correction codewords, the **generator polynomial** is the product of `n` linear factors `(x - 2^i)` for `i = 0, 1, ..., n-1`. Because subtraction is XOR, each factor is just `[1, 2^i]` - that is, `x + 2^i` - and `2^i` is `exp[i]` straight out of your antilog table. Multiply them together one at a time with the `polyMul` from the last lesson, starting from the constant polynomial `1`.

The result for `n` codewords has `n+1` coefficients, always leading with `1` (it is monic). `genPoly(2)` reproduces the `[1, 3, 2]` you already met, and `genPoly(7)` gives `[1, 127, 122, 154, 164, 11, 68, 117]` - the exact coefficients the standard lists for a 7-codeword generator. Each error-correction level in a QR symbol picks a different `n`, so this one function produces all of them. Next you will divide by this polynomial to get the actual recovery codewords.
