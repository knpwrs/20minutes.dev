---
project: build-a-midi-parser
lesson: 18
title: Meta event framing
overview: Not every event makes sound - meta events carry text, tempo, and structure. They all share one frame - 0xFF, a type byte, a variable-length length, then that many data bytes. Today you read that frame.
goal: Read a meta event's type byte and its variable-length data payload.
spec:
  scenario: A meta event frames a type and a length-prefixed payload
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0xFF 0x03 0x04 0x53 0x6F 0x6E 0x67'
    - kw: When
      text: 'they are parsed as a meta event'
    - kw: Then
      text: 'it is a meta event of type 0x03 (track name) with data "Song"'
    - kw: And
      text: 'the length 0x04 was read as a VLQ, so exactly 4 payload bytes were consumed'
code:
  lang: go
  source: |
    // 0xFF marks a meta event; then a type byte, then a VLQ length, then data
    r.NextByte()               // consume 0xFF
    metaType := r.NextByte()   // e.g. 0x03 = track name
    n := r.ReadVLQ()           // payload length
    data := r.buf[r.pos : r.pos+int(n)]
    r.pos += int(n)
checkpoint: You can read a meta event's type and payload. Commit and stop here.
---

A **meta event** is data for the sequencer rather than a message for a synth, and
they all share one envelope: the byte `0xFF`, a single **type** byte, a
**variable-length** payload length, and then exactly that many data bytes. `0xFF`
can never be confused with a channel status because it is reserved, and the VLQ
length means a reader can skip any meta type it does not recognise - the same
extensibility trick as chunks, one level down.

Type `0x03` is the **track name**, whose payload is ASCII text - `0x53 0x6F 0x6E
0x67` is `"Song"`. Type `0x01` is a general text comment, `0x02` copyright, `0x04`
instrument name; they all frame identically and differ only in meaning. Read the
frame generically today - type, length, raw payload - and the next few lessons give
specific types (tempo, time signature, key signature, end-of-track) their
interpretation.
