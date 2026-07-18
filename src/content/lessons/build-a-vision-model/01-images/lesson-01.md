---
project: build-a-vision-model
lesson: 1
title: A grayscale image
overview: An image is a grid of brightness values and two numbers telling you how to fold that grid into rows. Today you build that type - the one every later lesson operates on.
goal: Define a grayscale image type and build a 5x5 image whose pixels count up from 0.
spec:
  scenario: Building a grayscale image
  status: failing
  lines:
    - kw: Given
      text: 'a new grayscale image 5 pixels wide and 5 pixels high'
    - kw: And
      text: 'its pixels are filled with the numbers 0 through 24 in reading order - left to right, top to bottom'
    - kw: When
      text: the image is inspected
    - kw: Then
      text: 'its width is 5 and its height is 5'
    - kw: And
      text: 'it holds exactly 25 pixels'
    - kw: And
      text: 'the last pixel is 24'
code:
  lang: go
  source: |
    // one flat slice, not a slice of slices - the index math is the point
    type Image struct {
      Width, Height int
      Pixels        []uint8
    }
checkpoint: You have the type every later lesson operates on, and can build an image and read any pixel back. Commit and stop for today.
---

A grayscale image is a rectangle of **brightness** values: `0` is black, `255`
is white, and everything between is a shade of grey. That is all. The colour
images you are used to are three of these stacked - one for red, one for green,
one for blue - and every idea in this project works the same way on all three,
so we spend the whole project on one and keep the arithmetic readable.

The one design decision worth making now is how to store the grid. A slice of
slices reads nicely (`pixels[y][x]`) but scatters rows across memory and makes
every later loop clumsier. Instead keep **one flat list** of `Width * Height`
values and compute the offset yourself: the pixel at column `x`, row `y` lives
at index `y * Width + x`. Every convolution, pooling window and feature map for
the rest of the project is that one line of index arithmetic, so it is worth
getting comfortable with it today while the stakes are a counting exercise.
