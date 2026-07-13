---
project: build-a-midi-parser
lesson: 16
title: Running status
overview: To save space, a run of same-type events may omit the repeated status byte - when a data byte appears where a status is expected, the previous status is reused. Today you implement that rule, the last piece before a full event loop.
goal: Reuse the previous status byte when an event begins with a data byte.
spec:
  scenario: A data byte where a status is expected reuses the last status
  status: failing
  lines:
    - kw: Given
      text: 'a note-on 0x90 0x3C 0x64 was just parsed, so the running status is 0x90'
    - kw: When
      text: 'the next event begins with the bytes 0x3E 0x64 (no status byte)'
    - kw: Then
      text: 'it is a note-on on channel 0 with note 62 and velocity 100 (status 0x90 reused)'
    - kw: And
      text: 'the following bytes 0x40 0x00 are a note-off on channel 0 note 64 (running status, velocity 0)'
code:
  lang: go
  source: |
    // peek the next byte: high bit set = new status; high bit clear = reuse
    b := r.buf[r.pos]
    if b&0x80 != 0 {
      status = r.ReadByte() // real status byte; remember it
    } // else: reuse the remembered status, and the data bytes start here
checkpoint: You can parse events that omit a repeated status byte. Commit and stop here.
---

**Running status** is the format's main space saver. When several events in a row
share the same status - a chord's worth of note-ons, a sweep of control changes -
the file writes the status byte **once** and then just the data bytes for each
following event. The reader detects this by peeking: if the next byte has its high
bit **set** it is a new status byte; if the high bit is **clear** it is a data byte,
so reuse the **last status byte** you saw and start reading data immediately.

This is exactly why the high-bit invariant from the status-byte lesson mattered.
Two edges combine here: a running-status event reuses `0x90`, and because a note-on
with **velocity 0** is a note-off, the running bytes `0x40 0x00` become a note-off
without any `0x8` status ever appearing - the common way sequencers end notes.
Remember to update the running status whenever a real status byte *does* appear.
This is the last mechanism the event loop needs.
