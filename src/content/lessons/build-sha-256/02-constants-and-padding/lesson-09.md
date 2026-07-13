---
project: build-sha-256
lesson: 9
title: The sixty-four round constants
overview: Each of the 64 compression rounds adds a different fixed word, K[0] through K[63], derived from the cube roots of the first 64 primes. Today you pin that table and check its first value against its derivation.
goal: Provide the 64 round constants K0 through K63 as a fixed array of words.
spec:
  scenario: The round constant table matches the standard
  status: failing
  lines:
    - kw: Given
      text: 'the 64 SHA-256 round constants, the fractional parts of the cube roots of the first 64 primes, scaled by 2^32'
    - kw: When
      text: 'RoundConstants() returns them in order as K[0] through K[63]'
    - kw: Then
      text: 'K[0] is 0x428a2f98, K[1] is 0x71374491, and K[63] is 0xc67178f2'
    - kw: And
      text: 'K[0] equals floor((cbrt(2) - 1) * 2^32), which is 0x428a2f98'
code:
  lang: go
  source: |
    // 64 words: fractional bits of the cube roots of the first 64 primes
    func RoundConstants() [64]uint32 {
      return [64]uint32{
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        // ...60 more, ending in 0xbef9a3f7, 0xc67178f2
      }
    }
checkpoint: You have all 64 round constants. Commit and stop here.
---

The compression function runs **64 rounds**, and each round folds in a distinct
constant, `K[0]` through `K[63]`. Like the initial hash values these are "nothing
up my sleeve" numbers, but derived from **cube roots** instead of square roots:
each `K[t]` is the first 32 bits of the fractional part of the cube root of the
`(t+1)`-th prime. `K[0]` comes from the cube root of 2, `K[63]` from the cube root
of the 64th prime (311).

Transcribe all 64 from the standard - a wrong constant anywhere silently breaks
every hash from that round on. Sanity-check the ends and the derivation: `K[0]` is
`0x428a2f98`, which you can confirm as `floor((cbrt(2) - 1) * 2^32)`; `K[1]` is
`0x71374491`; and the last, `K[63]`, is `0xc67178f2`. These constants are consumed
one per round in the compression loop you build in chapter 4, so having the whole
table right now saves you from chasing a mismatch through 64 rounds later.
