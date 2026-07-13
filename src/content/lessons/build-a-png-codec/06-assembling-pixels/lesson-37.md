---
project: build-a-png-codec
lesson: 37
title: An RGBA image
overview: Pixels need a home. Today you build the image type the decoder fills and the encoder reads - a width, a height, and a flat RGBA buffer - with a clean accessor so every later lesson has one target to write into.
goal: Build an RGBA image type with a pixel setter and getter over a flat byte buffer.
spec:
  scenario: Storing and reading a pixel
  status: failing
  lines:
    - kw: Given
      text: 'a new 2-by-1 RGBA image'
    - kw: When
      text: 'pixel (0,0) is set to red, green, blue, alpha 10, 20, 30, 40 and the pixels are read back'
    - kw: Then
      text: 'pixel (0,0) reads 10, 20, 30, 40 and the untouched pixel (1,0) reads 0, 0, 0, 0'
    - kw: And
      text: 'pixels are stored row-major as four bytes each, so pixel (x,y) begins at byte (y*width + x) * 4'
code:
  lang: go
  source: |
    type Image struct { Width, Height int; Pix []uint8 } // 4 bytes/pixel RGBA
    func NewImage(w, h int) *Image { return &Image{w, h, make([]uint8, w*h*4)} }
    func (im *Image) Set(x, y int, r, g, b, a uint8) { }
    func (im *Image) At(x, y int) (r, g, b, a uint8) { }
checkpoint: You have an RGBA image type to decode into and encode from. Commit and stop here.
---

Every color type in PNG - grayscale, truecolor, palette, with or without alpha, at every bit depth - ultimately becomes the same thing on screen: **RGBA pixels**. So the decoder needs one common target, and the encoder one common source: an `Image` with a width, a height, and a flat buffer of **four bytes per pixel** (red, green, blue, alpha), stored **row-major** so pixel `(x,y)` lives at byte `(y*width + x) * 4`. Normalizing everything to RGBA8 keeps the rest of the codec simple - convert once at the edges, work in one representation in the middle.

A fresh image is all zeros, which reads as transparent black, and `Set`/`At` are the only two operations the pixel-assembly lessons need. This is the deliberate design choice that makes the color-type lessons short: each one just learns how to translate its raw bytes into `Set` calls. With the container, the inflater, and the unfilterer already producing raw bytes, this type is the last vessel before those bytes become a real picture.
