---
project: build-a-png-codec
lesson: 45
title: Pixels to filtered scanlines
overview: Before compression, pixels become scanlines - raw sample bytes with a leading filter byte per row. Today you serialize an image to those bytes using the simplest filter, None.
goal: Serialize an RGBA image to filtered scanline bytes using filter type 0 (None) on every row.
spec:
  scenario: Serializing pixels to scanlines
  status: failing
  lines:
    - kw: Given
      text: 'a 2-by-1 RGBA image with pixels 255,0,0,255 and 0,255,0,255'
    - kw: When
      text: it is serialized to filtered scanlines with filter None
    - kw: Then
      text: 'the bytes are 0, 255,0,0,255, 0,255,0,255 - a filter-type byte 0 followed by the two pixels'
    - kw: And
      text: 'every row is prefixed with its filter-type byte, so an H-row image yields H filter bytes total'
code:
  lang: go
  source: |
    // for each row y: append filter byte 0, then for each pixel append R,G,B,A.
    func toScanlines(im *Image) []byte { }
checkpoint: You can turn an image into filtered scanlines. Commit and stop here.
---

The decoder unfiltered scanlines into pixels; the encoder does the reverse, turning pixels back into **filtered scanlines**. Each row becomes a **filter-type byte** followed by the row's raw sample bytes - and the simplest, always-valid choice is filter **None** (type 0), which writes the samples unchanged. For a 2-pixel RGBA row that is a `0` byte then eight sample bytes. This is exactly the layout `Inflate` produced on the way in and `unfilter` consumed, now built rather than parsed.

Filter None produces a valid PNG that any decoder reads; it just does not help compression. That is a deliberate, honest starting point - correctness first, then squeeze. The next lesson adds the **Sub** filter as a real alternative so the encoder can reduce redundancy before compressing, but everything downstream (deflate, zlib, IDAT) works identically whichever filter each row used, because the filter byte travels with the row. Get the per-row filter byte and sample order right and these bytes are ready to compress.
