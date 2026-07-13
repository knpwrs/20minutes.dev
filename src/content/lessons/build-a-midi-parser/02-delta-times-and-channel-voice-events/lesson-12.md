---
project: build-a-midi-parser
lesson: 12
title: Note-on events, and velocity zero
overview: A note-on starts a note - unless its velocity is zero, which the standard says is really a note-off. Today you parse note-on and pin that surprising edge, because getting it wrong doubles or drops every note later.
goal: Parse a note-on event, treating a velocity of zero as a note-off.
spec:
  scenario: A note-on parses, but velocity zero becomes a note-off
  status: failing
  lines:
    - kw: Given
      text: 'the three bytes 0x90 0x3C 0x64'
    - kw: When
      text: 'they are parsed as a channel event'
    - kw: Then
      text: 'it is a note-on on channel 0 with note 60 and velocity 100'
    - kw: And
      text: '0x90 0x3C 0x00 parses as a note-off on channel 0 with note 60 (velocity 0 means note-off)'
code:
  lang: go
  source: |
    // 0x9n with velocity > 0 is NoteOn; velocity == 0 is really NoteOff
    // read note and velocity, then choose the Kind from the velocity
    if velocity == 0 {
      // Kind = "NoteOff"
    }
checkpoint: You can parse a note-on, and treat velocity zero as a note-off. Commit and stop here.
---

A **note-on** (high nibble `0x9`) starts a note: a note number and a **velocity**,
how hard the key was struck. `0x90 0x3C 0x64` is "channel 0, note 60, velocity 100."
Simple enough - except for one rule that trips every beginner.

By convention a note-on with **velocity 0** is not a silent note; it is a
**note-off**. Sequencers exploit this so a stream of note-ons can both start and
stop notes using running status (coming soon) without ever emitting a real `0x8`
status. So `0x90 0x3C 0x00` must parse as a note-off on note 60. Fold that decision
in here, at the source: if you skip it, later note-pairing will see a note started
and never ended, and your note durations will be wrong. This is the kind of edge
the whole project exists to pin.
