---
project: build-a-midi-parser
lesson: 26
title: Pairing notes
overview: A note lives as two events - a note-on and a later note-off - but musicians think in whole notes with a duration. Today you pair them into notes, using absolute ticks to compute how long each sounds.
goal: Pair each note-on with its matching note-off into a note with a start tick and duration.
spec:
  scenario: Note-on and note-off pair into a note with duration
  status: failing
  lines:
    - kw: Given
      text: 'a note-on of note 60 velocity 100 at absolute tick 0, then a note-off of note 60 at absolute tick 96'
    - kw: When
      text: 'the events are paired into notes'
    - kw: Then
      text: 'there is one note - pitch 60, start tick 0, duration 96, velocity 100'
    - kw: And
      text: 'a note-on with velocity 0 also closes an open note (it counts as a note-off)'
code:
  lang: go
  source: |
    type Note struct {
      Pitch, Velocity byte
      StartTick, Duration uint32
    }
    // key open notes by (channel, note); on note-off, duration = nowTick - startTick
    open := map[[2]byte]int{} // (channel, note) -> index of the open note
checkpoint: You can pair note-on and note-off into timed notes. Commit and stop here.
---

Events are how a file stores music, but **notes** are how people hear it: a pitch
that starts, sounds for a while, and stops. Pairing turns the two-event
representation into one. Walk the events in order; on a **note-on** remember that
this `(channel, note)` is open and at what absolute tick it began; on the matching
**note-off** compute `duration = offTick - onTick` and emit a finished `Note`.

Two details make it correct. Key the open notes by **channel and note number** so
overlapping notes on different keys pair with the right partners. And remember the
velocity-0 rule from earlier: a note-on with velocity 0 is a note-off, so it must
**close** an open note, not open a new one - the reason you folded that rule in at
the source. A note-on of note 60 at tick 0 closed at tick 96 is a note of duration
96, one quarter at a division of 96.
