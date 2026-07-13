---
project: build-a-midi-parser
lesson: 24
title: Parsing a complete track
overview: Now the event loop grows up - it dispatches on the status byte to handle channel messages, meta events, and SysEx alike, and stops at end-of-track. Today you parse a whole real track body into its event list.
goal: Parse a full track body, dispatching channel, meta, and SysEx events and stopping at end-of-track.
spec:
  scenario: A mixed track body parses into a full event list
  status: failing
  lines:
    - kw: Given
      text: 'a track body of delta 0 set-tempo, then delta 0 note-on 0x90 0x3C 0x64, then delta 96 note-off 0x80 0x3C 0x40, then delta 0 end-of-track (every event carries its own delta-time)'
    - kw: When
      text: 'the whole body is parsed'
    - kw: Then
      text: 'the result is four timed events - set-tempo, note-on, note-off, end-of-track - in order'
    - kw: And
      text: 'parsing stops at the end-of-track event and the reader has consumed the entire body'
code:
  lang: go
  source: |
    // dispatch on the byte where a status is expected
    switch {
    case b == 0xFF: // meta event (may be end-of-track -> break)
    case b == 0xF0: // system exclusive
    default:        // channel event, honoring running status
    }
checkpoint: You can parse a complete track body into its events. Commit and stop here.
---

Everything from the last two chapters converges here. The loop reads a delta-time,
then looks at the next byte to decide what kind of event follows: `0xFF` is a
**meta** event, `0xF0` a **SysEx**, and anything else is a **channel** event handled
with running status. Meta and SysEx never participate in running status, so seeing
one clears any remembered status. When the meta event is end-of-track, the loop
stops.

This is a genuine integration step, so it may take a little longer than a single
feature lesson - but it introduces no new decoding, only the **dispatch** that
routes each byte to the parser you already wrote. The reward is real: a whole track
body, tempo and notes and terminator together, becomes one ordered list of timed
events. With that, the remaining lessons stop looking at bytes entirely and start
turning events into music - absolute time, notes, and tempo.
