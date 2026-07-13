---
project: build-a-jpeg-codec
lesson: 1
title: The start and end markers
overview: Every JPEG file opens with a Start Of Image marker and closes with an End Of Image marker. Today you build the smallest useful thing a decoder can do - recognize that a byte stream even claims to be a JPEG - so the codec has a front door from day one.
goal: Report whether a byte slice begins with the SOI marker and whether it ends with the EOI marker.
spec:
  scenario: Recognizing the JPEG frame markers
  status: failing
  lines:
    - kw: Given
      text: 'a byte slice beginning with 0xFF, 0xD8 and ending with 0xFF, 0xD9'
    - kw: When
      text: the marker check runs on it
    - kw: Then
      text: it reports that the stream starts with SOI and ends with EOI
    - kw: And
      text: 'a slice starting with 0xFF, 0xD9, or one shorter than two bytes, reports no SOI'
code:
  lang: go
  source: |
    // markers are two bytes: 0xFF then a code byte
    const MarkerSOI = 0xD8 // Start Of Image
    const MarkerEOI = 0xD9 // End Of Image
    func HasSOI(b []byte) bool {
      // true only if b[0]==0xFF and b[1]==0xD8
    }
    func HasEOI(b []byte) bool {
      // true only if the last two bytes are 0xFF, 0xD9
    }
checkpoint: Your codec recognizes a JPEG by its opening marker and its closing marker. Commit and stop here.
---

Every JPEG file is framed by two **markers**. It opens with **SOI**, the Start Of Image marker, whose two bytes are `0xFF 0xD8`, and it closes with **EOI**, End Of Image, the bytes `0xFF 0xD9`. A marker is always a `0xFF` byte followed by a code byte that names it. These two are the outermost frame: everything a decoder reads lives between them.

You will not decode anything yet. You are building the one gate every decoder needs first: does this stream even claim to be a JPEG? Anything that does not begin with `0xFF 0xD8` is rejected before a single segment is read. Pin the edges now - a stream that is only one byte long must report no SOI rather than reading past its end, and a stream that starts with the EOI code `0xD9` is not a valid opening.
