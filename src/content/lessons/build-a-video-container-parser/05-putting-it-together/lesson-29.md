---
project: build-a-video-container-parser
lesson: 29
title: 'Capstone: inspect a real MP4'
overview: The finale parses a complete embedded MP4 from its first byte to its last and reports everything the project can see - the brand, the full box tree, and a per-track summary. Every parser you wrote proves itself at once on a real file.
goal: Parse an embedded tiny MP4 and report its ftyp brand, its box tree, and a per-track summary.
spec:
  scenario: A whole MP4 file parses to brand, tree, and track summary
  status: failing
  lines:
    - kw: Given
      text: 'an embedded MP4 with ftyp (major brand "isom") and moov/trak holding a video track: hdlr "vide", stsd "avc1", tkhd 320x240, mdhd duration 132300 at timescale 44100'
    - kw: When
      text: 'the file is parsed end to end'
    - kw: Then
      text: 'the major brand is "isom" and the box tree contains the path moov/trak/mdia/minf/stbl/stsd'
    - kw: And
      text: 'the one track summarises to Type "vide", Codec "avc1", Width 320.0, Height 240.0, DurationSec 3.0'
code:
  lang: go
  source: |
    file := parseTree(mp4Bytes)          // the whole box tree
    ft := parseFtyp(find(file, "ftyp").Payload)
    for _, trak := range findAll(file, "moov/trak") {
      summary := summarize(trak.Children) // Type, Codec, Width, Height, DurationSec
    }
    // assert ft.MajorBrand, the stbl path exists, and the track summary
checkpoint: Your parser turns a real MP4 into a brand, a box tree, and a track summary. The project is complete; commit and stop here.
---

This is the promise the project was built to keep: a real **MP4 parser**. The
embedded file is small but structurally honest - an `ftyp` brand box and a `moov`
holding one `trak`, whose `mdia` nests the media header, handler, and a full sample
table `stbl`. Parsing it exercises every layer at once: the box walker builds the
tree, `find` navigates it, the header parsers pull timescale and dimensions, and the
summary ties them into a single legible line.

From reading four big-endian bytes on day one, you have built the honest core of a
container parser: a faithful box tree and a per-track summary of type, codec,
dimensions, and duration, able to locate any sample's bytes. It stops short of
decoding the elementary streams inside `mdat` and of fragmented-MP4 and edit lists -
the same core that tools like `mp4box` and `ffprobe` extend. The finalize pass wraps
this in a small inspector command; what you have already is a genuine MP4 parser,
and it is yours.
