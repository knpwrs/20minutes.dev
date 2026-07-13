---
project: build-a-midi-parser
lesson: 11
title: Note-off events
overview: The first real event is a note-off - a status byte plus a note number and a release velocity. Today you parse one, and you give every event a common shape so later kinds slot in beside it.
goal: Parse a note-off event into its channel, note, and velocity.
spec:
  scenario: A note-off status and two data bytes parse to an event
  status: failing
  lines:
    - kw: Given
      text: 'the three bytes 0x80 0x3C 0x40'
    - kw: When
      text: 'they are parsed as a channel event'
    - kw: Then
      text: 'it is a note-off on channel 0 with note 60 and velocity 64'
    - kw: And
      text: '0x83 0x40 0x7F is a note-off on channel 3 with note 64 and velocity 127'
code:
  lang: go
  source: |
    // a shared shape for every event to come
    type Event struct {
      Kind    string // "NoteOff", "NoteOn", ...
      Channel byte
      Data1   byte // note number
      Data2   byte // velocity
    }
    // 0x8n: read two data bytes as note and velocity
checkpoint: You can parse a note-off event. Commit and stop here.
---

A **note-off** tells a synth to release a key. Its status high nibble is `0x8`, and
it carries two data bytes: the **note number** (`60` is middle C) and a **release
velocity** (how fast the key was let up, often ignored). So `0x80 0x3C 0x40` is
"channel 0, release note 60 at velocity 64."

Because this is the first of a whole family of events, decide its **shape** now: a
single `Event` value with a `Kind` tag, a channel, and the data bytes it needs.
Note-on, control change, and the rest will all reuse this one type, differing only
in the tag and how the data bytes are read - front-loading that shape keeps every
later event a one-line addition instead of a refactor. Pin two channels so the
low-nibble split stays honest.
