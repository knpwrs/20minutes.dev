---
project: build-a-midi-parser
lesson: 28
title: Ticks to seconds and beats
overview: The whole point of the division and the tempo was to turn abstract ticks into real time. Today you convert a tick to seconds and to beats, the calculation the capstone reports.
goal: Convert an absolute tick to seconds and to beats using the division and tempo.
spec:
  scenario: A tick converts to seconds and beats at a known tempo
  status: failing
  lines:
    - kw: Given
      text: 'a division of 96 ticks per quarter and a tempo of 500000 microseconds per quarter (120 BPM)'
    - kw: When
      text: 'tick 96 is converted'
    - kw: Then
      text: 'it is 0.5 seconds and 1.0 beats'
    - kw: And
      text: 'tick 48 is 0.25 seconds and 0.5 beats, and tick 0 is 0.0 seconds and 0.0 beats'
code:
  lang: go
  source: |
    // beats = tick / ppqn ; seconds = beats * usPerQuarter / 1e6
    beats := float64(tick) / float64(ppqn)
    seconds := beats * float64(usPerQuarter) / 1000000.0
checkpoint: You can convert a tick to seconds and beats. Commit and stop here.
---

This is the conversion the whole timing chapter was heading toward. The **division**
(ticks per quarter note) turns ticks into **beats**: `beats = tick / ppqn`, so at a
division of 96, tick 96 is exactly `1.0` beat. The **tempo** (microseconds per
quarter) turns beats into **seconds**: each beat lasts `usPerQuarter / 1000000`
seconds, so at 500000 microseconds a beat is half a second and tick 96 is `0.5`
seconds.

Keep it a constant-tempo calculation for now - one division, one tempo - which is
exactly right for the many files that never change tempo. When the tempo map has
several entries the honest version sums the seconds segment by segment between tempo
changes, but the arithmetic per segment is this same formula; converting across a
changing tempo is a natural extension noted in the caveats. Today, pin the clean
values: 96 ticks is half a second, 48 is a quarter second, 0 is zero.
