---
project: build-a-midi-parser
lesson: 27
title: The tempo map
overview: Tempo can change mid-song, so a single number will not do - you collect every set-tempo event with the tick where it takes effect. Today you build that tempo map, defaulting to 120 BPM when a file gives none.
goal: Collect set-tempo events into a tempo map keyed by absolute tick, with a sensible default.
spec:
  scenario: Set-tempo events collect into a tempo map
  status: failing
  lines:
    - kw: Given
      text: 'a track (track 0) with a set-tempo of 500000 microseconds per quarter at absolute tick 0'
    - kw: When
      text: 'the tempo map is built'
    - kw: Then
      text: 'it has one entry - tick 0 maps to 500000 microseconds per quarter'
    - kw: And
      text: 'a file with no set-tempo event yields a default map of 500000 (120 BPM) starting at tick 0'
code:
  lang: go
  source: |
    type TempoEntry struct {
      Tick        uint32
      UsPerQuarter uint32
    }
    // scan all tracks' events for set-tempo; if none, default to one 500000 at tick 0
    tempoMap := []TempoEntry{}
checkpoint: You can build a tempo map from set-tempo events. Commit and stop here.
---

Real music speeds up and slows down, so tempo is not one value but a **timeline** of
its own: a **tempo map** of `(tick, microseconds-per-quarter)` entries, each saying
"from this tick onward, play at this tempo." You build it by scanning events for
set-tempo meta events and recording each with its absolute tick. In a format-1 file
these live in **track 0**, the conductor track, which carries tempo and time
signature for the whole performance while the other tracks carry notes.

Two robustness points. Sort the entries by tick so lookups are simple. And handle
the common case of **no tempo event at all**: the standard says assume `500000`
microseconds per quarter - 120 BPM - so seed the map with that default at tick 0.
With a tempo map in hand, the next lesson can convert any tick to seconds, even
across a tempo change.
