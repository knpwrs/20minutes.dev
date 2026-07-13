---
project: build-a-midi-parser
lesson: 10
title: The status byte
overview: A channel event begins with a status byte whose high nibble names the message and low nibble names the channel. Today you split those two nibbles, the decode every later event lesson starts from.
goal: Split a status byte into its message type (high nibble) and channel (low nibble).
spec:
  scenario: A status byte splits into a message type and a channel
  status: failing
  lines:
    - kw: Given
      text: 'the status byte 0x90'
    - kw: When
      text: 'it is split'
    - kw: Then
      text: 'the message type is 0x9 (note-on) and the channel is 0'
    - kw: And
      text: '0x9F is note-on on channel 15, 0x83 is note-off on channel 3, and 0xE5 is pitch-bend on channel 5'
code:
  lang: go
  source: |
    // high nibble = message kind, low nibble = channel (0..15)
    func splitStatus(b byte) (kind byte, channel byte) {
      return b >> 4, b & 0x0F
    }
    // a status byte always has its high bit set (0x80..0xEF for channel messages)
checkpoint: You can split a status byte into a message type and a channel. Commit and stop here.
---

Channel voice messages are the heart of MIDI, and each one starts with a **status
byte** that carries two things at once. The **high nibble** (top four bits) is the
message kind: `0x8` note-off, `0x9` note-on, `0xA` polyphonic key pressure, `0xB`
control change, `0xC` program change, `0xD` channel pressure, `0xE` pitch bend. The
**low nibble** (bottom four bits) is the **channel**, `0` to `15`.

So `0x90` is note-on on channel `0`, and `0x9F` is note-on on channel `15`. One
invariant to lean on: a status byte always has its **high bit set** - channel
statuses run `0x80` through `0xEF` - while the data bytes that follow always have it
clear (`0x00`-`0x7F`). That single distinction is what makes running status
possible a few lessons from now. Today just split the nibbles; the next lessons give
each message kind its meaning.
