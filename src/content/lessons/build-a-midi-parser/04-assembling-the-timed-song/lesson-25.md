---
project: build-a-midi-parser
lesson: 25
title: Absolute ticks
overview: Delta-times are gaps between events; to place events on a timeline you add them up into absolute ticks from the start of the track. Today you make that running total.
goal: Convert a track's delta-times into absolute tick positions.
spec:
  scenario: Delta-times accumulate into absolute tick positions
  status: failing
  lines:
    - kw: Given
      text: 'a track whose events have delta-times 0, 96, and 96 in order'
    - kw: When
      text: 'the deltas are accumulated into absolute ticks'
    - kw: Then
      text: 'the absolute tick positions are 0, 96, and 192'
    - kw: And
      text: 'the first event is always at tick 0 regardless of later deltas'
code:
  lang: go
  source: |
    // running sum: each event sits at the previous total plus its own delta
    var tick uint32
    for i := range events {
      tick += events[i].Delta
      events[i].AbsTick = tick // add this field to TrackEvent
    }
checkpoint: You can place each event at an absolute tick. Commit and stop here.
---

A **delta-time** is relative - it says "wait this many ticks after the previous
event." That is compact for storage but useless for asking "what happens at tick
192?" So the first step toward timing is a **running total**: walk the events in
order, keep a sum, and each event's **absolute tick** is the sum after adding its
own delta. Deltas `0, 96, 96` become absolute ticks `0, 96, 192`.

Add an `AbsTick` field to each timed event and fill it in this one pass. Absolute
ticks are the common currency for everything left in the project: pairing a note-on
with the note-off that comes later, collecting tempo changes at the ticks where they
happen, and converting any tick to seconds. It is a tiny computation with a big
payoff - the whole track now lives on one shared timeline.
