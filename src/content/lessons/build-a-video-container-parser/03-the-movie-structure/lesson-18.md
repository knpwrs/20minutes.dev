---
project: build-a-video-container-parser
lesson: 18
title: The handler type and name
overview: The hdlr box says what kind of media a track carries - video, audio, or something else - and carries a human-readable name for it. Today you read both, which lets you tell a video track from an audio track and closes out the movie-structure chapter.
goal: Parse an hdlr box to its handler-type fourcc and its trailing name string.
spec:
  scenario: An hdlr yields its handler type and name
  status: failing
  lines:
    - kw: Given
      text: 'a version-0 hdlr with handler_type "vide" at payload offset 8, then 12 reserved bytes, then the null-terminated name "VideoHandler"'
    - kw: When
      text: 'the hdlr is parsed'
    - kw: Then
      text: 'the handler type is "vide" and the name is "VideoHandler"'
    - kw: And
      text: 'an hdlr whose handler_type is "soun" parses to handler type "soun"'
code:
  lang: go
  source: |
    // FullBox prefix(4) + pre_defined(4) + handler_type(4) + reserved(12) + name
    func parseHdlr(payload []byte) (handlerType, name string) {
      handlerType = readType(payload[8:12]) // handler_type fourcc
      // name runs from offset 24 to the end of the payload;
      // drop a trailing NUL if present
    }
checkpoint: You can read a track's handler type and name. Commit and stop here.
---

`hdlr`, the handler-reference box, declares the **kind** of a track with a fourcc:
`vide` for video, `soun` for audio, `subt` or `text` for subtitles, and a few
others. It lives inside `mdia` alongside `mdhd`. Being a FullBox, its handler_type
sits at payload offset 8, after the 4-byte prefix and a 4-byte pre_defined field
that is always zero. After the type come 12 reserved bytes, then a human-readable
**name** (like `VideoHandler`) that runs to the end of the box.

That name is a **null-terminated** string, so you read from offset 24 to the payload
end and drop a trailing `0x00` if it is there. The handler_type is what makes a
track summary meaningful: knowing a track is `vide` tells you to expect a width and
height, while `soun` tells you to expect a sample rate. With `mvhd`, `tkhd`,
`mdhd`, and now `hdlr` parsed, you have the movie's whole skeleton, and the next
chapter opens up the sample tables that describe the actual media samples.
