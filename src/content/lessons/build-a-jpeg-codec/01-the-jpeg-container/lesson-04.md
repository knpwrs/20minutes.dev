---
project: build-a-jpeg-codec
lesson: 4
title: Standalone markers
overview: A handful of markers carry no length and no payload at all. Today you classify a marker code as standalone or length-bearing, so the walker knows whether to read a length field after it.
goal: Report whether a marker code is standalone (no length field follows) or introduces a length-prefixed segment.
spec:
  scenario: Classifying standalone markers
  status: failing
  lines:
    - kw: Given
      text: 'the marker codes 0xD8 (SOI), 0xD9 (EOI), 0xD0 through 0xD7 (RST0 to RST7), and 0x01 (TEM)'
    - kw: When
      text: each is classified
    - kw: Then
      text: 'every one of them is standalone (no length field follows)'
    - kw: And
      text: 'a code like 0xE0 (APP0) or 0xC0 (SOF0) is not standalone, so a length field follows it'
code:
  lang: go
  source: |
    // standalone markers have NO length and NO payload:
    //   SOI 0xD8, EOI 0xD9, RST0..RST7 0xD0..0xD7, TEM 0x01
    func isStandalone(code byte) bool {
      // return true for exactly those codes
    }
checkpoint: You can tell a standalone marker from a length-prefixed segment. Commit and stop here.
---

Most markers introduce a length-prefixed segment, but a small set are **standalone**: they are just the two marker bytes with nothing after them, no length and no payload. The standalone codes are **SOI** (`0xD8`), **EOI** (`0xD9`), the eight **restart** markers **RST0** through **RST7** (`0xD0` to `0xD7`), and **TEM** (`0x01`). When the walker meets one of these it must not try to read a length field, because there is not one.

Knowing this split is what makes a robust marker walk possible. After reading a marker code you ask one question - standalone or not - and either advance two bytes or read a length and skip the segment. The restart markers in particular reappear in the middle of the entropy scan much later, and treating them as standalone there is exactly right.
