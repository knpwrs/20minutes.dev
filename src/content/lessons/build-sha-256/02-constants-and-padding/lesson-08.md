---
project: build-sha-256
lesson: 8
title: The eight initial hash values
overview: SHA-256 starts every hash from eight fixed 32-bit words, derived from the fractional parts of the square roots of the first eight primes. Today you pin those eight constants and see where the first one comes from.
goal: Provide the eight initial hash values H0 through H7 as a fixed array of words.
spec:
  scenario: The initial hash state matches the standard
  status: failing
  lines:
    - kw: Given
      text: 'the eight SHA-256 initial hash values, the fractional parts of the square roots of the first eight primes (2, 3, 5, 7, 11, 13, 17, 19), scaled by 2^32'
    - kw: When
      text: 'InitialHash() returns them in order as H[0] through H[7]'
    - kw: Then
      text: 'H[0] is 0x6a09e667, H[4] is 0x510e527f, and H[7] is 0x5be0cd19'
    - kw: And
      text: 'H[0] equals floor((sqrt(2) - 1) * 2^32), which is 0x6a09e667'
code:
  lang: go
  source: |
    // the fractional bits of the square roots of the first 8 primes
    func InitialHash() [8]uint32 {
      return [8]uint32{
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
      }
    }
checkpoint: You have the eight initial hash values. Commit and stop here.
---

SHA-256 begins from a fixed starting state: **eight 32-bit words**, `H[0]` through
`H[7]`, that every hash of every message starts from. They are not arbitrary
magic - each is the first 32 bits of the fractional part of the square root of one
of the first eight primes. Using an irrational constant like this is a "nothing up
my sleeve" number: it demonstrably was not hand-picked to hide a weakness, because
anyone can rederive it.

You can check the first one yourself. `sqrt(2)` is `1.41421356...`; drop the
integer part to get the fraction `0.41421356...`, multiply by `2^32`, and take the
floor - the result is `0x6a09e667`, exactly `H[0]`. The other seven follow the
same recipe with primes 3, 5, 7, 11, 13, 17, and 19. You do not need to recompute
them at runtime (the standard just lists the words), but pinning `H[0]`, the
middle `H[4] = 0x510e527f`, and the last `H[7] = 0x5be0cd19` confirms you have
transcribed the table correctly - these are the words the compression function
starts from.
