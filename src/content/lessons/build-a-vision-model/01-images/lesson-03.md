---
project: build-a-vision-model
lesson: 3
title: Pixel access and bounds
overview: Every filter in this project reads a pixel's neighbours, and at the border some of those neighbours do not exist. Today you decide what happens then - and build both answers, because you will need each one.
goal: Build two pixel readers that disagree only outside the image - one clamping to the edge, one returning zero.
spec:
  scenario: Reading inside and outside the image
  status: failing
  lines:
    - kw: Given
      text: 'the 5 by 5 image whose pixel at column x, row y holds the value y times 5 plus x'
    - kw: When
      text: pixels are read through the clamping reader
    - kw: Then
      text: 'reading column 2, row 2 gives 12'
    - kw: And
      text: 'reading column -1, row 2 gives 10 - the read is pulled to column 0 of that same row'
    - kw: And
      text: 'reading column 99, row 99 gives 24 - the read is pulled to the bottom-right pixel'
    - kw: When
      text: the same out-of-bounds reads go through the zero reader
    - kw: Then
      text: 'reading column -1, row 2 gives 0, and so does column 99, row 99'
code:
  lang: go
  source: |
    // clamping: drag the coordinate back to the nearest legal one, then read
    func (img *Image) At(x, y int) uint8 {
      // pin x into 0..Width-1 and y into 0..Height-1, then index as usual
    }
checkpoint: Reading any coordinate is safe, and you have two documented answers for what lies outside the image. Commit and stop for today.
---

A 3 by 3 filter centred on the top-left pixel wants to read the row above it and
the column to its left. Neither exists. Every image-processing library answers
this differently and none of them is wrong: you can **clamp** (pretend the edge
pixel repeats forever outwards), return **zero** (pretend the image sits on a
black background), wrap around, or mirror. What you cannot do is ignore it - an
unguarded read is a crash or, worse, silently reads a neighbouring row's pixel
and produces a filter that works everywhere except the borders.

Build both readers now, because this project genuinely needs both. Clamping is
what you want for blurring a photograph, where a black border would darken the
edges into a visible frame. Zero is what you want for a convolutional layer,
where a hard zero is a well-defined, differentiable thing to have padded with.
Note that the choice is only observable *outside* the image - both readers agree
on every pixel that really exists, which is why picking one carelessly can hide
for a long time.
