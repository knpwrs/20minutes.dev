---
project: build-a-png-codec
lesson: 1
title: The eight-byte signature
overview: Every PNG file begins with the same eight magic bytes. Today you build the smallest useful thing a decoder can do - recognize that a byte stream even claims to be a PNG - so the codec has a front door from day one.
goal: Report whether a byte slice begins with the exact PNG signature.
spec:
  scenario: Recognizing the PNG magic bytes
  status: failing
  lines:
    - kw: Given
      text: 'the byte sequence 137, 80, 78, 71, 13, 10, 26, 10 followed by any other bytes'
    - kw: When
      text: the signature check runs on it
    - kw: Then
      text: it reports true
    - kw: And
      text: 'a sequence whose first byte is 138 instead of 137, or one shorter than eight bytes, reports false'
code:
  lang: go
  source: |
    // the fixed 8-byte PNG signature
    var Signature = []byte{0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}
    func HasSignature(b []byte) bool {
      // true only if b starts with all eight signature bytes
    }
checkpoint: Your codec recognizes a PNG by its signature and rejects anything else. Commit and stop here.
---

Every PNG file opens with the same **eight-byte signature**: `89 50 4E 47 0D 0A 1A 0A`. It is carefully chosen. The high bit of the first byte (`0x89`) catches transmission over channels that strip bit 7; the ASCII `PNG` (`50 4E 47`) is human-readable in a hex dump; and the `0D 0A`, `1A`, `0D 0A` bytes detect the kinds of newline mangling and file truncation that plagued early binary formats.

You will not decode anything yet. You are building the one gate every decoder needs first: does this stream even claim to be a PNG? Anything that does not begin with these exact bytes is rejected before a single chunk is read. Pin the edges now - the wrong first byte fails, and a stream shorter than eight bytes fails rather than reading past its end.
