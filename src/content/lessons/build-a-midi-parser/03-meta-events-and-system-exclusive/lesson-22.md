---
project: build-a-midi-parser
lesson: 22
title: End-of-track
overview: Every track ends with one required meta event - end-of-track - and it must land exactly at the track's byte length. Today you detect it and use it to stop the event loop cleanly.
goal: Detect the end-of-track meta event and stop parsing exactly at the track's length.
spec:
  scenario: End-of-track terminates the track at its chunk length
  status: failing
  lines:
    - kw: Given
      text: 'a track body ending in the bytes 0xFF 0x2F 0x00, with the body length matching the bytes exactly'
    - kw: When
      text: 'the event loop reaches that event'
    - kw: Then
      text: 'it is recognised as end-of-track and parsing stops'
    - kw: And
      text: 'the reader position equals the track body length - no bytes are read past the end-of-track'
code:
  lang: go
  source: |
    // meta type 0x2F, length 0: the required last event of every track
    if metaType == 0x2F {
      // record an EndOfTrack event and break out of the event loop
    }
checkpoint: You can detect end-of-track and stop the loop. Commit and stop here.
---

Every `MTrk` must finish with an **end-of-track** meta event: `0xFF 0x2F 0x00` - type
`0x2F`, length `0`, no payload. It is not decoration; it is the official signal that
the track is over, and a well-formed file places it so the reader's position lands
**exactly** at the track body's length. That equality is a strong correctness check:
if you stop before the end there are trailing bytes you mishandled, and if you read
past it your event decoding drifted.

Until now the event loop stopped when the bytes ran out; from here it should stop
when it **sees end-of-track**, which is more precise and matches how a real file is
framed. Detecting it cleanly is what lets the next chapter parse a *complete* track -
tempo and time signature in a conductor track, notes in another - and trust that
each track begins and ends where the chunk says it does.
