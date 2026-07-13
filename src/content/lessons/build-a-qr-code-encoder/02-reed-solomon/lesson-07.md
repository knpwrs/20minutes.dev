---
project: build-a-qr-code-encoder
lesson: 7
title: Multiplying polynomials
overview: 'Reed-Solomon treats a run of codewords as the coefficients of a polynomial over GF(256). Before you can build the error-correction machinery you need to multiply two such polynomials. Today you write that multiply using the field arithmetic from chapter one.'
goal: 'Multiply two GF(256) polynomials, combining coefficients with field multiply and add.'
spec:
  scenario: 'Polynomial product over the field'
  status: failing
  lines:
    - kw: Given
      text: 'polynomials represented as coefficient slices, highest degree first, so [1, 1] is x + 1 and [1, 2] is x + 2'
    - kw: When
      text: 'polyMul([1, 1], [1, 2]) is called'
    - kw: Then
      text: 'it returns [1, 3, 2], meaning x^2 + 3x + 2 - the middle coefficient is gadd(gmul(1,2), gmul(1,1)) = 2 XOR 1 = 3'
    - kw: And
      text: 'every coefficient product uses gmul and every accumulation uses gadd (XOR), never ordinary integer arithmetic'
code:
  lang: go
  source: |
    // Coefficients are highest-degree-first. result[i+j] gathers
    // the product of term i of a and term j of b, XOR-accumulated.
    func polyMul(a, b []byte) []byte {
      r := make([]byte, len(a)+len(b)-1)
      for i := range a {
        for j := range b {
          r[i+j] ^= gmul(a[i], b[j])
        }
      }
      return r
    }
checkpoint: 'You can multiply polynomials over GF(256). Commit and stop here.'
---

Reed-Solomon views a block of codewords as a **polynomial**: the codewords are its coefficients. So the toolkit you need is polynomial arithmetic, but with every `+` and `*` replaced by the field operations `gadd` and `gmul` you already built. Represent a polynomial as a slice of coefficients, **highest degree first**, matching how you write it on paper: `[1, 3, 2]` is `x^2 + 3x + 2`.

Multiplication is the familiar "multiply every term by every term and collect like powers", where the term of degree `i` in `a` times the term of degree `j` in `b` lands at degree `i+j`. Collecting like powers means XOR-ing the partial products together, not adding them. Multiplying `x + 1` by `x + 2` gives `x^2` (from `1*1`), then `1*2` and `1*1` both land on the `x` term and XOR to `3`, then `1*2` gives the constant `2` - so `[1, 3, 2]`. That single small product is the first brick of the generator polynomial you assemble next.
