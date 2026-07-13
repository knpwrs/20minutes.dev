---
project: build-a-png-codec
lesson: 36
title: 'Unfiltering a whole image'
overview: Now the five filters combine into one pass over every scanline, reading each row's filter byte and undoing it. Today you turn the inflated bytes into a clean rectangle of raw pixel bytes.
goal: Unfilter every scanline of an inflated image, dispatching on each row's filter-type byte, to produce the raw pixel bytes.
spec:
  scenario: Reconstructing a full image
  status: failing
  lines:
    - kw: Given
      text: 'inflated bytes for a 2-pixel-wide RGBA image: row 0 filter byte 0 then 8 raw bytes, row 1 filter byte 2 (Up) then 8 bytes each equal to 1'
    - kw: When
      text: the image is unfiltered
    - kw: Then
      text: 'row 0 is its 8 raw bytes unchanged and row 1 is each of row 0 byte plus 1'
    - kw: And
      text: 'each row reads its own leading filter-type byte, and rows are processed top to bottom so each can use the finished row above'
code:
  lang: go
  source: |
    // for each row: first byte is the filter type, the rest is raw scanline data.
    // dispatch: 0 None, 1 Sub, 2 Up, 3 Average, 4 Paeth. keep the reconstructed
    // previous row (start with a zero row) to feed Up/Average/Paeth.
    func unfilter(data []byte, width, bpp int) []byte { }
checkpoint: You can unfilter a whole image into raw pixel bytes. Commit and stop here.
---

This assembles the chapter into one function. Walk the inflated bytes row by row using the stride from lesson 31. Each row's **first byte is its filter type** (`0` to `4`); the remaining `stride - 1` bytes are the filtered scanline. Dispatch on that byte to the matching reconstruction, feeding in the reconstructed **previous row** for the filters that need what is above - and start with an all-zero previous row so the first row's above-neighbors are 0.

The output is the image as a clean grid of **raw pixel bytes**, filter bytes stripped, each channel back to its true value. Every row can use a *different* filter - encoders pick per row for best compression - so the dispatch happens once per scanline, not once per image. With unfiltering done you are one step from pixels: these raw bytes still need to be grouped into pixels according to the color type and bit depth, which is the whole of the next chapter. The hard mechanical work of decoding is behind you.
