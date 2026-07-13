---
project: build-a-midi-parser
lesson: 29
title: Assembling the song
overview: One public entry point ties it all together - bytes in, a song out. Today you build Parse, which reads the header and every track into a single song model with events, notes, and a tempo map.
goal: Build a Parse function that turns SMF bytes into a song of header, tracks, notes, and tempo map.
spec:
  scenario: Parsing bytes yields a complete song model
  status: failing
  lines:
    - kw: Given
      text: 'a format-1 file with an MThd (division 96), a conductor track with a set-tempo, and a track with one note-on/note-off pair'
    - kw: When
      text: 'the bytes are parsed with Parse'
    - kw: Then
      text: 'the song has format 1, division 96, two tracks, and a tempo map with one entry'
    - kw: And
      text: 'the note track yields one paired note, and each track holds its events with absolute ticks'
code:
  lang: go
  source: |
    type Song struct {
      Format, Division uint16
      Tracks   []Track   // each with Events (abs ticks) and Notes
      TempoMap []TempoEntry
    }
    // Parse: splitChunks -> header from MThd -> parse each MTrk -> abs ticks,
    // notes, tempo map. Return a friendly error on malformed input.
checkpoint: You have a Parse function that builds a whole song. Commit and stop here.
---

Every piece now exists in isolation; **assembly** is its own design decision. `Parse`
is the library's front door: split the bytes into chunks, read the `MThd` for format
and division, parse each `MTrk` body into events, then run the timing passes -
absolute ticks per track, note pairing per track, and one tempo map across the file.
The result is a single `Song` value a caller can inspect without ever touching a
byte.

This is the deliverable the whole project was building toward: an importable parser
whose one public function takes raw SMF bytes and returns a structured song of
tracks, events, notes, and tempo. Have it return a clear **error** for malformed
input - a body that is not `MThd`, a truncated chunk - rather than panicking, so the
API is safe to hand any file. Tomorrow the capstone drives this function on a real
multi-track file and reads back the whole performance.
