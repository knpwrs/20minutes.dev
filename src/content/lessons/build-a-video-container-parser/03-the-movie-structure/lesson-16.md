---
project: build-a-video-container-parser
lesson: 16
title: The track's display dimensions
overview: A track's width and height live at the end of tkhd, stored as 16.16 fixed-point numbers rather than plain integers. Today you write that fixed-point conversion and use it to read a track's real pixel dimensions.
goal: Read a tkhd's width and height as 16.16 fixed-point values and convert them to real numbers.
spec:
  scenario: tkhd dimensions decode from 16.16 fixed point
  status: failing
  lines:
    - kw: Given
      text: 'a version-0 tkhd whose width field (at payload offset 76) is 0x01400000 and whose height field (at offset 80) is 0x00F00000'
    - kw: When
      text: 'the track dimensions are read'
    - kw: Then
      text: 'the width is 320.0 and the height is 240.0'
    - kw: And
      text: 'the underlying 16.16 conversion turns 0x00018000 into 1.5 (one and a half)'
code:
  lang: go
  source: |
    // 16.16 fixed point: divide the raw 32-bit value by 65536
    func fixed16(v uint32) float64 { return float64(v) / 65536.0 }
    // in tkhd v0, width is the uint32 at payload offset 76, height at 80
    func tkhdDimensions(payload []byte) (width, height float64) {
      // read the two fields and convert each with fixed16
    }
checkpoint: You can read a track's display dimensions. Commit and stop here.
---

`tkhd` stores a track's display **width** and **height** as **16.16 fixed-point**
values: the top 16 bits are the whole-number part and the bottom 16 bits are a
fraction in units of 1/65536. It is a compact way to allow fractional dimensions
(useful for non-square-pixel scaling) inside a plain 32-bit field. To read one, you
divide the raw integer by `65536`, so `0x01400000` (which is `0x0140` = `320` in the
top half) becomes exactly `320.0`, and `0x00018000` becomes `1.5`.

These two fields sit near the **end** of the track header, after a 36-byte transform
matrix, at payload offsets 76 and 80 in the version-0 layout. Pulling them out and
converting gives you the first genuinely visual fact about a track - its picture
size. The same 16.16 form appears in the `tkhd` matrix and the `mvhd` playback rate,
so the tiny `fixed16` helper earns its keep, and the track summary later reports
these numbers directly.
