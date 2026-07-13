---
project: build-a-game-boy-emulator
lesson: 32
title: Swapping nibbles
overview: Today you implement SWAP B, which exchanges the high and low nibbles of a byte - a small operation that turns out to be the fast path for binary-coded decimal conversion and moving packed two-digit values.
goal: Implement SWAP B so it exchanges the high and low nibbles of a byte and updates the flags accordingly.
spec:
  scenario: Swapping the two nibbles of a byte
  status: failing
  lines:
    - kw: Given
      text: B is 0xAB and the opcode is CB 0x30
    - kw: When
      text: SWAP B runs
    - kw: Then
      text: B is 0xBA
    - kw: And
      text: with B of 0x00, SWAP sets the Z flag and clears N, H, and C
code:
  lang: go
  source: |
    case 0x30: // SWAP B
        // Exchange the two nibbles of B - shift the low nibble up and the high
        // nibble down, then OR them together. Flags: Z from the result, and clear
        // N, H, AND C (SWAP is the one op in this family that also clears carry).
reading: 'SWAP - exchange the upper and lower nibbles of a byte.'
checkpoint: The spec now works and SWAP exchanges nibbles and clears the carry. Commit and stop here.
---

`SWAP B` (CB opcode `0x30`) exchanges the **high and low nibbles** of a byte:
`0xAB` becomes `0xBA`. It is a shift by four in each direction OR-ed together,
and it clears `N`, `H`, and `C` while setting `Z` from the result. There is no
carry involved - nothing falls off the ends, the two halves just trade places.

It seems niche, but nibble-swapping is genuinely useful: it converts a value to
and from packed **binary-coded decimal**, and it is the fast way to move the
high nibble into the low position for things like reading a two-digit score
digit. It also rounds out the shift-and-rotate family, leaving just the bit-test
and bit-set instructions to finish the CB table.
