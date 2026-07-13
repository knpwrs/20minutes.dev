---
project: build-a-midi-parser
lesson: 23
title: System exclusive
overview: System-exclusive messages carry manufacturer data of any length, framed in a file with a variable-length byte count. Today you read that frame and step over the payload, so a SysEx never derails the event loop.
goal: Parse a system-exclusive event, reading its variable-length payload.
spec:
  scenario: A SysEx event reads a length-prefixed payload
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0xF0 0x03 0x43 0x10 0xF7'
    - kw: When
      text: 'they are parsed as a system-exclusive event'
    - kw: Then
      text: 'it is a SysEx event whose 3-byte payload is 0x43 0x10 0xF7'
    - kw: And
      text: 'the length 0x03 was read as a VLQ, so the reader advances exactly past the payload to the next event'
code:
  lang: go
  source: |
    // 0xF0 begins SysEx; a VLQ length follows, then that many payload bytes
    r.NextByte()          // consume 0xF0
    n := r.ReadVLQ()      // payload length (3)
    data := r.buf[r.pos : r.pos+int(n)]
    r.pos += int(n)       // the payload usually ends in 0xF7
checkpoint: You can parse a system-exclusive event. Commit and stop here.
---

A **system-exclusive** (SysEx) message is a manufacturer's private data - a synth
patch, a device query - and it can be any length. Inside a Standard MIDI File it is
framed like a meta event: the byte `0xF0`, a **variable-length** byte count, then
that many payload bytes (the payload normally ends in the terminator `0xF7`). Read
the VLQ length and step the reader exactly past the payload.

You do not need to interpret the bytes to handle them correctly - the length tells
you precisely how far to jump, so an unknown SysEx never confuses the event loop.
This is the last event kind. With channel messages, meta events, and SysEx all
readable, the event loop can now walk any real track from its first delta-time to
its end-of-track, which is exactly what the next chapter builds on.
