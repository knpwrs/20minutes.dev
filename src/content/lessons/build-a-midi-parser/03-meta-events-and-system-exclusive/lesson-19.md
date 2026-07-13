---
project: build-a-midi-parser
lesson: 19
title: Set-tempo
overview: Tempo lives in a meta event as microseconds per quarter note - a three-byte number that later turns ticks into seconds. Today you decode it and derive the familiar beats-per-minute.
goal: Decode a set-tempo meta event into microseconds per quarter note and BPM.
spec:
  scenario: Set-tempo bytes decode to microseconds per quarter and BPM
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0xFF 0x51 0x03 0x07 0xA1 0x20'
    - kw: When
      text: 'they are parsed as a set-tempo meta event'
    - kw: Then
      text: 'the tempo is 500000 microseconds per quarter note, which is 120 BPM'
    - kw: And
      text: '0xFF 0x51 0x03 0x0F 0x42 0x40 is 1000000 microseconds per quarter note, which is 60 BPM'
code:
  lang: go
  source: |
    // meta type 0x51, always length 3: a big-endian 24-bit microseconds-per-quarter
    usPerQuarter := uint32(d[0])<<16 | uint32(d[1])<<8 | uint32(d[2])
    bpm := 60000000 / usPerQuarter // 500000 -> 120
checkpoint: You can decode a set-tempo event into microseconds per quarter and BPM. Commit and stop here.
---

MIDI does not store tempo as beats per minute; it stores **microseconds per quarter
note**, a meta event of type `0x51` with a length of 3 and a big-endian 24-bit
value. `0x07 0xA1 0x20` is `500000` - half a million microseconds, half a second,
per quarter note. That is the default every file assumes when no tempo is given.

Beats per minute is just the reciprocal in friendlier units: a quarter note is a
beat, there are 60 million microseconds in a minute, so `BPM = 60000000 /
usPerQuarter`. `500000` gives `120`, and doubling the microseconds to `1000000`
halves the tempo to `60`. Keep the microsecond value as the source of truth - it is
what the tick-to-seconds math will use directly - and treat BPM as the derived,
human-readable view.
