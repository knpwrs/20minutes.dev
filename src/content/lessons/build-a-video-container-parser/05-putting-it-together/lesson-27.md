---
project: build-a-video-container-parser
lesson: 27
title: A per-track summary
overview: Now you gather everything about one track into a single summary - its kind, codec, dimensions, and duration - by navigating the tree and reusing the parsers you built. This is the media-inspector view a user actually reads.
goal: Build a TrackSummary from a trak subtree by combining hdlr, stsd, tkhd, and mdhd.
spec:
  scenario: A trak summarises to type, codec, dimensions, and duration
  status: failing
  lines:
    - kw: Given
      text: 'a trak whose hdlr handler is "vide", stsd codec is "avc1", tkhd width is 320.0 and height is 240.0, and mdhd duration is 132300 at timescale 44100'
    - kw: When
      text: 'the track is summarised'
    - kw: Then
      text: 'the summary is Type "vide", Codec "avc1", Width 320.0, Height 240.0, DurationSec 3.0'
    - kw: And
      text: 'the width and height come from the tkhd 16.16 fields decoded to real numbers'
code:
  lang: go
  source: |
    type TrackSummary struct {
      Type, Codec   string
      Width, Height float64
      DurationSec   float64
    }
    // use find() to reach tkhd, mdia/hdlr, mdia/mdhd, mdia/minf/stbl/stsd
    // then reuse each box's parser and fixed16() for the dimensions
    func summarize(trak []Box) TrackSummary { /* fill in */ }
checkpoint: You can summarise a track. Commit and stop here.
---

A **track summary** is the line an inspector prints per track: what kind of media it
is, which codec, how big, how long. Every piece already exists - you just have to
gather them. Use `find` to reach the handler (`mdia/hdlr`), the codec
(`mdia/minf/stbl/stsd`), the dimensions (`tkhd`, decoded through the 16.16
converter), and the timing (`mdia/mdhd`, divided into seconds).

The `tkhd` **width** and **height** are the two 16.16 fixed-point fields at the very
end of the track-header box, which is why you built the converter earlier. This
lesson is mostly wiring, but it is the wiring that turns a pile of parsed boxes into
something legible - and it is exactly what the capstone prints for every track in a
real file.
