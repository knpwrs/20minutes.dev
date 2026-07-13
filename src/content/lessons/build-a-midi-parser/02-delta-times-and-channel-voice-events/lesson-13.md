---
project: build-a-midi-parser
lesson: 13
title: The two-data-byte events
overview: Two more channel messages carry two data bytes each and parse exactly like a note - control change and polyphonic key pressure. Today you add both, reusing the shape you already have.
goal: Parse control change and polyphonic key pressure, each with two data bytes.
spec:
  scenario: Two-data-byte channel messages parse to events
  status: failing
  lines:
    - kw: Given
      text: 'the three bytes 0xB0 0x07 0x7F'
    - kw: When
      text: 'they are parsed as a channel event'
    - kw: Then
      text: 'it is a control change on channel 0 with controller 7 and value 127'
    - kw: And
      text: '0xA0 0x3C 0x40 is polyphonic key pressure on channel 0 with note 60 and pressure 64'
code:
  lang: go
  source: |
    // both take two data bytes; only the Kind and the field names differ
    switch kind {
    case 0xB: // ControlChange: Data1 = controller, Data2 = value
    case 0xA: // PolyKeyPressure: Data1 = note, Data2 = pressure
    }
checkpoint: You can parse control change and polyphonic key pressure. Commit and stop here.
---

**Control change** (high nibble `0xB`) is how a performance moves knobs and pedals:
a **controller number** and a **value**. `0xB0 0x07 0x7F` sets controller 7 (channel
volume) to 127 on channel 0. **Polyphonic key pressure** (`0xA`) is per-note
aftertouch: a note number and a pressure amount.

Both read exactly like a note-off or note-on - a status byte then two data bytes -
so they cost you almost nothing now that the `Event` shape exists. Only the `Kind`
tag and what the two data bytes *mean* differ. Add them side by side; each distinct
behaviour (the `0xB` case and the `0xA` case) gets its own asserted example so the
nibble dispatch is covered. That leaves just the one- and zero-nibble oddballs and
pitch bend before every channel message is handled.
