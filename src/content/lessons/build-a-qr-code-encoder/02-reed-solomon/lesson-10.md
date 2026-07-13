---
project: build-a-qr-code-encoder
lesson: 10
title: Reed-Solomon codewords
overview: 'Now the payoff of the chapter: the error-correction codewords for a block are the remainder of its data divided by the generator. Today you assemble the encoder and run it on the real HELLO WORLD data block, producing its exact 13 recovery codewords.'
goal: 'Compute the n error-correction codewords for a data block as its remainder by genPoly(n).'
spec:
  scenario: 'Error-correction codewords for the worked example'
  status: failing
  lines:
    - kw: Given
      text: 'the 13 data codewords of HELLO WORLD at level Q: [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236]'
    - kw: When
      text: 'rsEncode(data, 13) pads with 13 zeros and takes polyRem against genPoly(13)'
    - kw: Then
      text: 'it returns exactly 13 error-correction codewords [168, 72, 22, 82, 217, 54, 156, 0, 46, 15, 180, 122, 16]'
    - kw: And
      text: 'the 8th codeword is 0 - a zero is a perfectly valid codeword, not a bug'
code:
  lang: go
  source: |
    // Append n zeros to make room, divide by the n-codeword
    // generator, and the remainder IS the error correction.
    func rsEncode(data []byte, n int) []byte {
      msg := append(append([]byte(nil), data...), make([]byte, n)...)
      return polyRem(msg, genPoly(n))
    }
checkpoint: 'You can generate the error-correction codewords for any block. Reed-Solomon works - commit and stop here.'
---

Everything in this chapter has been building to one line: **the error-correction codewords are the remainder of the data polynomial divided by the generator**. Treat the data codewords as a polynomial, shift it up by `n` places (append `n` zeros) to leave room, divide by `genPoly(n)`, and the `n`-coefficient remainder is your recovery data. That is the whole of Reed-Solomon encoding.

Run it on the actual HELLO WORLD block - the 13 data codewords you will learn to *produce* in the next chapter - and you get `[168, 72, 22, 82, 217, 54, 156, 0, 46, 15, 180, 122, 16]`, matching the published worked example codeword for codeword. Notice the `0` in the eighth slot: field elements include zero, and a zero codeword is ordinary. These 13 numbers are what let a scanner reconstruct the message even when part of the symbol is smudged or torn. Next you will confirm the deep property that makes this work, then move on to producing the data codewords themselves.
