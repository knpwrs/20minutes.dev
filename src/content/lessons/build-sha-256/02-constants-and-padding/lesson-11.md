---
project: build-sha-256
lesson: 11
title: The extra-block boundary
overview: When a message nearly fills a block, the 0x80 marker and the 8-byte length no longer fit alongside it, so padding spills into a whole extra block. Today you pin that boundary - the case that trips up naive implementations.
goal: Confirm padding forces a second block exactly when the message length is 56 mod 64 bytes.
spec:
  scenario: A 56-byte message pads to two blocks, a 55-byte message to one
  status: failing
  lines:
    - kw: Given
      text: 'the padding rule from the previous lesson'
    - kw: When
      text: 'Pad is applied to a 56-byte message and to a 55-byte message'
    - kw: Then
      text: 'the 56-byte message pads to 128 bytes (two blocks): the 0x80 marker and the trailing zeros fill the rest of block 1, and block 2 is 56 zero bytes followed by the length 0x00 0x00 0x00 0x00 0x00 0x00 0x01 0xc0 (448 bits)'
    - kw: And
      text: 'the 55-byte message pads to exactly 64 bytes (one block), ending in the length 0x00 0x00 0x00 0x00 0x00 0x00 0x01 0xb8 (440 bits)'
code:
  lang: go
  source: |
    // no special case needed - the same rule handles it:
    //   append 0x80, then zeros while len%64 != 56, then the 8-byte length.
    // for a 56-byte message the 0x80 lands at byte 56, so there is no room
    // for the length in this block; the loop pads all the way into the next.
    padded := Pad(make([]byte, 56))
    // len(padded) == 128
checkpoint: You have pinned the boundary where padding needs a whole extra block. Commit and stop here.
---

The interesting edge of padding is when the message *almost* fills a block. Each
64-byte block reserves its last 8 bytes for the length, leaving 56 bytes. A
message of exactly **56 bytes** already uses all 56, so the mandatory `0x80`
marker has nowhere to go in that block, let alone the length - padding must open a
**whole new block** just to hold them. This is the `448-mod-512` boundary (56
bytes is 448 bits), and it is where a naive "just top up the current block"
implementation breaks.

The reassuring part is that the rule from last lesson already handles it with no
special case: append `0x80`, add zeros while the length is not `56 mod 64`, then
append the 8-byte length. For a 56-byte message the `0x80` pushes you to 57 bytes,
the loop runs all the way around to 120, and the length lands at bytes 120 to 127
- a 128-byte, two-block result whose final word is the bit length `0x1c0`
(448). One byte shorter, a 55-byte message, still fits in a single 64-byte block.
Pin both: the same code must produce one block at 55 bytes and two at 56.
