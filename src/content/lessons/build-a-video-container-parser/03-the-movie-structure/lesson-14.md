---
project: build-a-video-container-parser
lesson: 14
title: The movie header (version 1)
overview: When a movie is long enough, mvhd switches to a version-1 layout with 64-bit times. Today you branch on the version byte and read the wider fields, pinning down exactly how the FullBox version selects a layout.
goal: Parse a version-1 mvhd, reading its 64-bit duration correctly.
spec:
  scenario: A version-1 mvhd reads 64-bit times
  status: failing
  lines:
    - kw: Given
      text: 'an mvhd payload with version 1, 64-bit creation and modification times, timescale 0x00 0x00 0x02 0x58, then a 64-bit duration 0x00 0x00 0x00 0x01 0x00 0x00 0x00 0x00'
    - kw: When
      text: 'the mvhd is parsed'
    - kw: Then
      text: 'the timescale is 600 and the duration is 4294967296'
    - kw: And
      text: 'the same parser on the version-0 box from yesterday still gives timescale 1000 and duration 5000'
code:
  lang: go
  source: |
    func parseMvhd(payload []byte) (timescale uint32, duration uint64) {
      version, _ := parseFullBox(payload)
      if version == 1 {
        // creation(8) modification(8) timescale(4) duration(8)
        // timescale at offset 20, duration (64-bit) at offset 24
      } else {
        // the version-0 layout from yesterday
      }
    }
checkpoint: You can parse both mvhd versions. Commit and stop here.
---

In version 1, `mvhd` stores creation time, modification time, and duration as
**64-bit** values (the timescale stays 32-bit). So the offsets shift: after the
4-byte prefix come creation (8) and modification (8), putting timescale at offset 20
and the 64-bit duration at offset 24. The version byte you read from the FullBox
prefix is the switch that picks which layout to use.

This is the reason `duration` was a `uint64` from the start. Here the duration
`0x0000000100000000` is exactly `4294967296` - a value that a 32-bit reader would
truncate to `0`. A parser that ignored the version byte would read the wrong bytes
entirely. The same version-selects-width pattern appears in `tkhd` and `mdhd`; once
you have it here, those follow the same shape.
