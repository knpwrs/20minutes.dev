---
project: build-a-midi-parser
lesson: 17
title: Parsing an event stream
overview: Now the pieces come together - a loop that reads a delta-time, then an event, then repeats, threading running status through the whole track. Today you turn a run of bytes into a list of timed events.
goal: Parse a sequence of delta-time plus channel event into a list of timed events.
spec:
  scenario: A byte run parses into a list of delta-timed events
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0x00 0x90 0x3C 0x64 0x60 0x3C 0x00 (two events, the second using running status)'
    - kw: When
      text: 'the stream is parsed into timed events'
    - kw: Then
      text: 'the first is delta 0, a note-on on channel 0 note 60 velocity 100'
    - kw: And
      text: 'the second is delta 96, a note-off on channel 0 note 60 (running status, velocity 0)'
code:
  lang: go
  source: |
    type TrackEvent struct {
      Delta uint32
      Event Event
    }
    // loop: delta = r.ReadVLQ(); ev = readEvent(r, &status); append
    // readEvent (from the running-status lesson) threads the status across events
    // stop when the reader runs out of bytes
checkpoint: You can parse a run of bytes into a list of timed events. Commit and stop here.
---

An event in a track is always a **delta-time then an event**, back to back, so the
loop is simple: read a VLQ delta, parse one channel event (carrying the running
status across iterations), pair them into a `TrackEvent`, and repeat until the bytes
run out. The delta is the number of ticks to wait *before* this event - `0x60` is
96 ticks, one quarter note at a division of 96.

This is the chapter's payoff: a raw slice of track bytes becomes a tidy list of
`(delta, event)` pairs, running status and the velocity-0 rule all handled. The
example packs both a full note-on and a running-status note-off into seven bytes,
which is exactly how a real track spells "play middle C for one beat." Next chapter
adds the events that are *not* channel messages - meta events and system exclusive -
so the loop can handle a whole real track.
