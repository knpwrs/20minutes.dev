---
project: build-a-midi-parser
lesson: 15
title: Pitch bend
overview: Pitch bend needs more resolution than seven bits, so it splits a 14-bit value across two data bytes, low seven bits first. Today you reassemble that number and pin its center and extremes.
goal: Parse a pitch-bend event, assembling its two data bytes into a 14-bit value.
spec:
  scenario: Two data bytes assemble into a 14-bit bend value
  status: failing
  lines:
    - kw: Given
      text: 'the three bytes 0xE0 0x00 0x40'
    - kw: When
      text: 'they are parsed as a pitch-bend event'
    - kw: Then
      text: 'it is pitch bend on channel 0 with value 8192 (center, no bend)'
    - kw: And
      text: '0xE0 0x00 0x00 is value 0 (fully down) and 0xE0 0x7F 0x7F is value 16383 (fully up)'
code:
  lang: go
  source: |
    // 0xEn: first data byte is the LOW 7 bits, second is the HIGH 7 bits
    lsb := r.NextByte()
    msb := r.NextByte()
    bend := uint16(msb)<<7 | uint16(lsb) // 0..16383, 8192 is center
checkpoint: You can parse a pitch-bend event into a 14-bit value. Commit and stop here.
---

**Pitch bend** (high nibble `0xE`) sweeps a note's pitch smoothly, and 128 steps
are not enough resolution, so it uses **14 bits** spread over its two data bytes.
The catch is the order: the **first** data byte holds the **low** seven bits (LSB)
and the **second** holds the **high** seven bits (MSB). Reassemble with
`msb << 7 | lsb`.

The three values to pin are the ones that matter musically: `0x00 0x40` is `8192`,
the **center** where the wheel rests and no bending happens; `0x00 0x00` is `0`,
bent fully down; and `0x7F 0x7F` is `16383`, bent fully up. Get the shift and the
byte order right and those three land exactly. This is the last channel voice
message - after today every `0x8` through `0xE` status is covered, and you can wire
them together with running status.
