---
project: build-a-midi-parser
lesson: 14
title: The one-data-byte events
overview: Two channel messages break the pattern by carrying a single data byte - program change and channel pressure. Today you handle them, which matters most for running status, where the byte count decides where the next event begins.
goal: Parse program change and channel pressure, each with one data byte.
spec:
  scenario: One-data-byte channel messages parse to events
  status: failing
  lines:
    - kw: Given
      text: 'the two bytes 0xC0 0x05'
    - kw: When
      text: 'they are parsed as a channel event'
    - kw: Then
      text: 'it is a program change on channel 0 selecting program 5'
    - kw: And
      text: '0xD3 0x40 is channel pressure on channel 3 with pressure 64'
code:
  lang: go
  source: |
    // these read ONE data byte, not two
    switch kind {
    case 0xC: // ProgramChange: Data1 = program number
    case 0xD: // ChannelPressure: Data1 = pressure
    }
    // Data2 is unused for these
checkpoint: You can parse program change and channel pressure. Commit and stop here.
---

Not every channel message carries two data bytes. **Program change** (high nibble
`0xC`) selects an instrument sound with a single byte - `0xC0 0x05` picks program 5
on channel 0. **Channel pressure** (`0xD`) is channel-wide aftertouch, one byte of
pressure applied to every sounding note.

The single-byte count is easy to parse but load-bearing: how many data bytes a
status consumes is *determined by its kind*, and the next lesson-and-a-half of work
(running status, then the event loop) depends on getting that count right, because
it decides where the next event starts. Note which kinds take one byte (`0xC`,
`0xD`) and which take two (`0x8`, `0x9`, `0xA`, `0xB`, `0xE`) - that table is the
core of the whole channel-event decoder.
