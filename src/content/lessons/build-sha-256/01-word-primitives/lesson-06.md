---
project: build-sha-256
lesson: 6
title: The big sigma functions
overview: The round function scrambles the working words e and a with the two "big sigma" functions - each an XOR of three different rotations of the input. Today you build BigSigma0 and BigSigma1 and pin their exact outputs.
goal: Build the two big sigma functions as XORs of three rotations each.
spec:
  scenario: The big sigma functions XOR three rotations
  status: failing
  lines:
    - kw: Given
      text: 'the definitions BigSigma0(x) = ROTR(x,2) XOR ROTR(x,13) XOR ROTR(x,22) and BigSigma1(x) = ROTR(x,6) XOR ROTR(x,11) XOR ROTR(x,25)'
    - kw: When
      text: 'they are evaluated on the SHA-256 initial words'
    - kw: Then
      text: 'BigSigma0(0x6a09e667) is 0xce20b47e'
    - kw: And
      text: 'BigSigma1(0x510e527f) is 0x3587272b'
code:
  lang: go
  source: |
    // three rotations XOR'd together - note these use ONLY ROTR, never SHR
    func BigSigma0(x uint32) uint32 {
      return ROTR(x, 2) ^ ROTR(x, 13) ^ ROTR(x, 22)
    }
    // BigSigma1 uses rotation amounts 6, 11, 25
    func BigSigma1(x uint32) uint32 { /* fill in */ return 0 }
checkpoint: You can compute both big sigma functions. Commit and stop here.
---

The **big sigma** functions (written with the uppercase Greek sigma in the
standard) are how SHA-256 diffuses the state words during compression. Each is
just an XOR of three **rotations** of its input by fixed amounts: `BigSigma0` uses
`2, 13, 22`, and `BigSigma1` uses `6, 11, 25`. There is no shift here - big sigma
is pure rotation, which is what distinguishes it from the small sigma functions
you build next. Getting the three rotation amounts exactly right is the whole job.

These feed the round computation: `BigSigma0` mixes the word `a` and `BigSigma1`
mixes the word `e` every round. Pin them against the real SHA-256 constants so you
know the rotations are correct before they get buried inside 64 rounds:
`BigSigma0(0x6a09e667)` (the first initial hash value) is `0xce20b47e`, and
`BigSigma1(0x510e527f)` (the fifth) is `0x3587272b`. A wrong rotation amount will
still produce *a* number here, so check against these exact values, not just that
it runs.
