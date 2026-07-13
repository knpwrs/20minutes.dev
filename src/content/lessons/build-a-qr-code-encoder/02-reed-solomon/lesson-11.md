---
project: build-a-qr-code-encoder
lesson: 11
title: Why the codewords are divisible
overview: 'A short confirming lesson that reveals why Reed-Solomon works: the data and error-correction codewords together form a polynomial that the generator divides exactly. Today you prove that property on the worked example, with no new machinery.'
goal: 'Show that data followed by its error-correction codewords divides the generator with zero remainder.'
spec:
  scenario: 'The full codeword polynomial is divisible by the generator'
  status: failing
  lines:
    - kw: Given
      text: 'the 13 HELLO WORLD data codewords followed by their 13 error-correction codewords, a 26-coefficient polynomial'
    - kw: When
      text: 'polyRem of that full sequence against genPoly(13) is computed'
    - kw: Then
      text: 'the remainder is all zeros - the generator divides the full codeword polynomial exactly'
    - kw: And
      text: 'flipping any single data codeword and re-dividing yields a non-zero remainder, which is exactly the signal a decoder uses to detect an error'
code:
  lang: go
  source: |
    // data ++ ec, divided by the generator, leaves no remainder.
    full := append(append([]byte(nil), data...), ec...)
    rem := polyRem(full, genPoly(13))
    // every coefficient of rem is 0
checkpoint: 'You have seen why Reed-Solomon works: the codewords are a multiple of the generator. Commit and stop here.'
---

This lesson writes almost no new code - it exists to make the previous one click. By constructing the error-correction codewords as a **remainder** and appending them, you arranged for the combined data-plus-EC polynomial to be an exact **multiple of the generator**: dividing it leaves remainder `0`. That is not a coincidence, it is the definition of a valid Reed-Solomon codeword, and it is the whole trick. A clean symbol is always divisible by the generator.

When damage flips a module, it changes a codeword, and the polynomial stops being divisible - the remainder comes back non-zero. A decoder computes that remainder (the "syndromes") to first notice something is wrong and then to locate and repair it. You are only building the encoder here, so detection and repair are out of scope, but seeing the zero remainder is the payoff that proves your generator, your division, and your field arithmetic all agree. With error correction solid, the next chapter turns real text into the data codewords you have been feeding in by hand.
