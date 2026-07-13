---
project: build-a-midi-parser
lesson: 20
title: Time signature
overview: The time signature meta event stores four bytes, and the denominator is the tricky one - it is a power of two, not the number itself. Today you decode all four and get the denominator right.
goal: Decode a time-signature meta event, expanding the denominator as a power of two.
spec:
  scenario: Time-signature bytes decode with a power-of-two denominator
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0xFF 0x58 0x04 0x06 0x03 0x24 0x08'
    - kw: When
      text: 'they are parsed as a time-signature meta event'
    - kw: Then
      text: 'the time signature is 6/8 with 36 MIDI clocks per metronome click and 8 thirty-second notes per quarter'
    - kw: And
      text: '0xFF 0x58 0x04 0x04 0x02 0x18 0x08 is 4/4 (denominator 2 to the power 2)'
code:
  lang: go
  source: |
    // meta type 0x58, length 4: numerator, denominator-power, clocks, 32nds
    numerator := d[0]
    denominator := 1 << d[1] // 3 -> 8, 2 -> 4
    clocksPerClick := d[2]
    thirtySecondsPerQuarter := d[3]
checkpoint: You can decode a time-signature meta event. Commit and stop here.
---

The **time signature** meta event (type `0x58`, length 4) packs four values. The
first is the **numerator** as written - `6` for 6/8. The second is the surprise: the
**denominator** is stored as the **power of two**, not the value, so `3` means `2^3
= 8`, and `2` means `2^2 = 4`. Expand it with a shift: `1 << d[1]`.

The last two bytes describe the metronome and notation: **clocks per metronome
click** (there are 24 MIDI clocks per quarter note, so `0x24 = 36` clocks makes the
metronome tick every dotted quarter) and the number of **thirty-second notes per
quarter note** (`8`, the normal value). Decode all four, but the one that bites is
the denominator - miss the power-of-two and 6/8 reads as 6/3. Pin both a compound
6/8 and a plain 4/4.
