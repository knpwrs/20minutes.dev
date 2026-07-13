---
project: build-sha-256
lesson: 16
title: The eight working variables
overview: Compressing a block runs on eight working variables, a through h, that start as a copy of the current hash state and get stirred by the rounds. Today you set up that initialization - the first step of the compression function.
goal: Initialize the eight working variables a through h from the current hash state.
spec:
  scenario: Working variables start as a copy of the hash state
  status: failing
  lines:
    - kw: Given
      text: 'the current hash state, the eight words H[0..7] (for a first block, the initial hash values)'
    - kw: When
      text: 'the working variables are initialized as a=H[0], b=H[1], c=H[2], d=H[3], e=H[4], f=H[5], g=H[6], h=H[7]'
    - kw: Then
      text: 'starting from the initial hash values, a is 0x6a09e667 and e is 0x510e527f'
    - kw: And
      text: 'h is 0x5be0cd19, and the eight working variables together equal the eight hash words in order'
code:
  lang: go
  source: |
    // a..h are the mutable state the 64 rounds will stir
    func initWorking(h [8]uint32) (a, b, c, d, e, f, g, hh uint32) {
      return h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7]
    }
checkpoint: You can initialize the working variables from the hash state. Commit and stop here.
---

The compression function transforms one block into an updated hash state, and it
does its work in **eight working variables** named `a` through `h`. Every time it
starts on a block, those eight are seeded with a straight copy of the current hash
words `H[0]` through `H[7]` - `a` gets `H[0]`, `e` gets `H[4]`, and so on. For the
very first block of a message the hash state is still the initial hash values from
lesson 8, so `a` starts as `0x6a09e667` and `h` as `0x5be0cd19`.

Keeping the working variables separate from the hash state matters: the rounds
churn `a` through `h` heavily, and only at the very end of the block are the
churned values added *back* into `H`. That separation is what makes the final
addition - a few lessons from now - meaningful. Today is just the clean starting
copy; the next lesson is where a single round begins mutating it.
