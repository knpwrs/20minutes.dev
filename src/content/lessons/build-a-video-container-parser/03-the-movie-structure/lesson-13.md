---
project: build-a-video-container-parser
lesson: 13
title: The movie header (version 0)
overview: The mvhd box holds the whole movie's timing - the timescale and the duration that later turn into seconds. Today you parse the common version-0 layout, your first real FullBox with meaningful fields.
goal: Parse a version-0 mvhd box to its timescale and duration.
spec:
  scenario: A version-0 mvhd yields timescale and duration
  status: failing
  lines:
    - kw: Given
      text: 'an mvhd payload with version 0, then zeroed creation and modification times, then timescale 0x00 0x00 0x03 0xE8 and duration 0x00 0x00 0x13 0x88'
    - kw: When
      text: 'the version-0 mvhd is parsed'
    - kw: Then
      text: 'the timescale is 1000 and the duration is 5000'
    - kw: And
      text: 'the version read from the FullBox prefix is 0'
code:
  lang: go
  source: |
    // version 0 layout after the 4-byte FullBox prefix:
    // creation(4) modification(4) timescale(4) duration(4) ...
    func parseMvhd(payload []byte) (timescale uint32, duration uint64) {
      version, _ := parseFullBox(payload)
      // for version 0: timescale at offset 12, duration at offset 16
    }
checkpoint: You can parse a version-0 mvhd. Commit and stop here.
---

`mvhd`, the movie header, sits directly under `moov` and carries the movie-wide
clock. Two fields matter most: the **timescale**, the number of time units per
second, and the **duration**, the movie's length in those units. Divide one by the
other and you get seconds - which you will do explicitly later. Everything else in
`mvhd` (creation and modification times, playback rate, volume, a transform matrix)
you can skip past.

Because `mvhd` is a FullBox, its real fields start after the 4-byte
version-and-flags prefix. In version 0 the times and duration are 32-bit, so after
the prefix you have creation (4), modification (4), then timescale at offset 12 and
duration at offset 16. Here timescale `0x3E8` is `1000` and duration `0x1388` is
`5000`, a 5-second movie. Version 1 widens these fields - that is tomorrow.
