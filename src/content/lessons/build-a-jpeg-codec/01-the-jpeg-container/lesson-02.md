---
project: build-a-jpeg-codec
lesson: 2
title: Reading a marker
overview: A JPEG is a sequence of markers, and a marker can be preceded by any number of 0xFF fill bytes. Today you read one marker from a position, skipping fill bytes, so the decoder can step from one marker to the next.
goal: Read the marker code at a position, skipping any leading 0xFF fill bytes before the code byte.
spec:
  scenario: Reading a marker code past fill bytes
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0xFF, 0xFF, 0xC0 at a position'
    - kw: When
      text: a marker is read there
    - kw: Then
      text: 'the marker code is 0xC0 and reading consumed all three bytes'
    - kw: And
      text: 'the single marker 0xFF, 0xDA reads code 0xDA after consuming two bytes'
code:
  lang: go
  source: |
    // a marker is 0xFF then a code byte; extra 0xFF bytes before the code
    // are legal padding and are skipped. The code is never 0x00 or 0xFF.
    func readMarker(b []byte, pos int) (code byte, next int) {
      // require b[pos]==0xFF; skip further 0xFF bytes; the next byte is the code
    }
checkpoint: You can read a marker code at any position, tolerating fill bytes. Commit and stop here.
---

A marker is introduced by a `0xFF` byte, but the standard allows **any number of extra `0xFF` bytes** to appear as padding before the code byte that actually names the marker. So `FF FF C0` and `FF C0` both name the same marker, `0xC0` (which happens to be SOF0, the baseline frame header you will meet soon). A reader that steps through markers must skip those fill bytes and land on the real code.

Two byte values can never be a marker code: `0x00` (that pairing is reserved for byte-stuffing inside the entropy stream, much later) and `0xFF` itself (it is fill). Every real marker code is something else, like `0xD8`, `0xC0`, or `0xDA`. Returning the position just past the code byte lets the caller keep walking, which is exactly what the next lessons do to find each segment in turn.
