---
project: build-a-midi-parser
lesson: 5
title: The division field
overview: The division field has two meanings hiding in one 16-bit number, chosen by its top bit - ticks per quarter note, or an SMPTE frame rate. Today you tell them apart so later lessons can turn ticks into time.
goal: Interpret a division value as either ticks-per-quarter or an SMPTE rate.
spec:
  scenario: The top bit selects ticks-per-quarter or SMPTE timing
  status: failing
  lines:
    - kw: Given
      text: 'a division value of 0x0060 (top bit clear)'
    - kw: When
      text: 'it is interpreted'
    - kw: Then
      text: 'it is metrical timing with 96 ticks per quarter note'
    - kw: And
      text: 'a division of 0xE250 (top bit set) is SMPTE timing at 30 frames per second with 80 ticks per frame'
code:
  lang: go
  source: |
    // bit 15 set means SMPTE; the high byte is a signed negative frame rate
    func divisionKind(d uint16) (smpte bool, a int, b int) {
      if d&0x8000 == 0 {
        return false, int(d), 0 // ticks per quarter note
      }
      fps := -int(int8(d >> 8)) // high byte is a signed 8-bit value
      return true, fps, int(d & 0xFF)
    }
checkpoint: You can classify a division as metrical or SMPTE timing. Commit and stop here.
---

The **division** is the file's clock. When its top bit (bit 15) is **clear**, the
whole 16-bit value is **ticks per quarter note** - the metrical mode almost every
file uses. `0x0060` is `96`, so 96 delta-ticks make one quarter note, and once you
know the tempo you can turn ticks into seconds.

When the top bit is **set**, the field is **SMPTE** timing instead. The high byte
is a *negative* frame rate stored as a signed 8-bit value - `0xE2` is `-30`, so
30 frames per second - and the low byte is ticks per frame, `0x50` is `80`. That
gives absolute frame-based timing independent of tempo. This project does its time
math in the metrical mode; recognising SMPTE now means later code can flag it
rather than compute a wrong number.
