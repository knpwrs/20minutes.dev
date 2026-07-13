---
project: build-a-qr-code-encoder
lesson: 9
title: Polynomial remainder
overview: 'Reed-Solomon codewords are the remainder when your message polynomial is divided by the generator. Today you write that division - the synthetic long-division loop over GF(256) - and read back the remainder.'
goal: 'Divide a message polynomial by a monic divisor and return the remainder coefficients.'
spec:
  scenario: 'Long division over the field yields a remainder'
  status: failing
  lines:
    - kw: Given
      text: 'a message [1, 2, 3] padded with 2 trailing zeros to make room for a degree-1 remainder, divided by the monic generator [1, 3, 2]'
    - kw: When
      text: 'polyRem([1, 2, 3, 0, 0], [1, 3, 2]) runs the long-division loop'
    - kw: Then
      text: 'it returns the last 2 coefficients as the remainder [4, 4]'
    - kw: And
      text: 'each step multiplies the whole divisor by the current leading coefficient and XORs it out, since the divisor is monic (leading coefficient 1)'
code:
  lang: go
  source: |
    // Work on a copy. For each of the leading positions, use that
    // coefficient to cancel the divisor beneath it (XOR). The tail
    // that is left, as wide as the remainder, is the answer.
    func polyRem(msg, div []byte) []byte {
      r := append([]byte(nil), msg...)
      for i := 0; i <= len(msg)-len(div); i++ {
        c := r[i]
        if c != 0 {
          for j := range div {
            r[i+j] ^= gmul(div[j], c)
          }
        }
      }
      return r[len(msg)-(len(div)-1):]
    }
checkpoint: 'You can take the remainder of a polynomial division over GF(256). Commit and stop here.'
---

Dividing polynomials over GF(256) is the same synthetic division you learned in school, with XOR standing in for subtraction. Walk the dividend from its highest-degree coefficient. At each position the current coefficient tells you how much of the **divisor** to cancel there: multiply the whole divisor by that coefficient and XOR it into the working array, which zeroes the leading term and folds the rest downward. Because the generator is **monic** - its leading coefficient is `1` - you never have to divide to find the multiple; the leading coefficient *is* the multiple.

You pad the message with as many trailing zeros as there are error-correction codewords, so the remainder has somewhere to accumulate. After the loop, the low `len(div)-1` coefficients are the **remainder** - here `[4, 4]`. That remainder is precisely the Reed-Solomon error-correction data; the next lesson wraps this division into the encoder and runs it on the real HELLO WORLD block.
