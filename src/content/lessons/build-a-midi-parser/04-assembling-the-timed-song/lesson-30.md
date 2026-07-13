---
project: build-a-midi-parser
lesson: 30
title: 'Capstone: reading a real file'
overview: The finale parses a genuine format-1 MIDI file - header, a conductor track with tempo and time signature, and a note track - and reports the whole performance. Every layer you built proves itself at once.
goal: Parse an embedded multi-track SMF and report its tracks, tempo, time signature, and notes with timings.
spec:
  scenario: A real format-1 file parses into a full, timed report
  status: failing
  lines:
    - kw: Given
      text: 'an embedded format-1 file - MThd division 96; track 0 with set-tempo 500000 and time signature 4/4; track 1 with note-on/off pairs for note 60 then note 64, each a quarter note long'
    - kw: When
      text: 'the file is parsed and reported'
    - kw: Then
      text: 'the report reads format 1, 2 tracks, 120 BPM, 4/4, and two notes'
    - kw: And
      text: 'note 60 starts at tick 0 (0.0 s) for duration 96, and note 64 starts at tick 96 (0.5 s) for duration 96'
code:
  lang: go
  source: |
    song, _ := Parse(embeddedSMF)
    // format 1, 2 tracks, division 96
    // tempoBPM(song.TempoMap[0]) == 120 ; timeSig == "4/4"
    // notes: {60, tick 0, 0.0s, dur 96}, {64, tick 96, 0.5s, dur 96}
checkpoint: Your parser reads a real MIDI file into a complete, timed song. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real **Standard MIDI File
parser**. The embedded file is small but complete - a proper `MThd`, a format-1
conductor track carrying tempo and time signature, and a second track of notes -
and parsing it exercises every layer at once. Chunk splitting finds the header and
both tracks; the event loop decodes meta events and channel messages with running
status; the timing passes place each event on the tick timeline, pair the notes, and
build the tempo map; and the tick-to-seconds math turns note 64's start at tick 96
into `0.5` seconds.

The report is what a musician would want to know: the file is format 1 with 2
tracks, plays at 120 BPM in 4/4, and contains two quarter notes - middle C from 0.0
seconds and the E above it from 0.5 seconds. From reading four bytes as a length on
day one, you have built the honest core of a real MIDI parser: chunks,
variable-length quantities, every channel voice message, running status, meta events
and SysEx, and a timed song model. It parses, it does not play - and turning those
bytes into an exact performance is entirely yours.
