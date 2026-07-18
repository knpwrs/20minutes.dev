---
project: build-a-vision-model
lesson: 7
title: Padding and borders
overview: The convolution from lesson 6 needs a neighbour for every pixel, including ones at the edge of the image - the exact problem lesson 3 solved with two pixel readers. Today you wire those readers into the convolution and see the two different-shaped answers they give.
goal: Convolve the same kernel from lesson 6 across a full image two ways - zero-padded to the same size, and unpadded (valid-only) - and confirm the output size and border values each gives.
spec:
  scenario: Same-size vs valid-only convolution
  status: failing
  lines:
    - kw: Given
      text: 'the 5 by 5 image from lesson 1, whose pixels count up 0 through 24, and the kernel from lesson 6 (rows 1 0 -1, 1 0 -1, 1 0 -1)'
    - kw: When
      text: 'the kernel is convolved across the whole image, reading every neighbour through the zero reader from lesson 3'
    - kw: Then
      text: 'the output is 5 by 5, the same size as the input'
    - kw: And
      text: 'the top-left corner is -7 and the top-right corner is 11, both different from the interior value of -6, because the zero-padded neighbours pull the sum away from what a full neighbourhood would give'
    - kw: When
      text: 'the same kernel is convolved again, this time reading only through the clamping reader and the loop never asks for a pixel outside the image at all'
    - kw: Then
      text: 'the output shrinks to 3 by 3 - one row and one column of border pixels are lost on every side'
    - kw: And
      text: 'every value in that 3 by 3 output is -6, matching the patch result from lesson 6 exactly, since there are no padded neighbours left to disturb it'
code:
  lang: go
  source: |
    // "same": read every neighbor through AtZero (lesson 3) - reads beyond
    // the edge come back 0, so the output stays 5x5
    Convolve3x3Same(img, kernel)
    // "valid": narrow the loop instead, so every read stays in range and
    // AtZero is never needed; output shrinks by one row/column per side
    Convolve3x3Valid(img, kernel)
checkpoint: You can produce both a same-size, zero-padded convolution and a shrunk valid-only one from the same kernel, and know exactly which lesson-3 reader each one relies on. Commit and stop for today.
---

Lesson 6's kernel only ever touched pixels that existed. A real image convolution needs a neighbour for every one of the nine cells at every pixel, including the pixels at row 0 or the last column, whose neighbourhoods spill off the edge. That is exactly the gap lesson 3 built two readers to fill: `At` clamps the coordinate back onto the image, `AtZero` returns 0 outside it.

Wire `AtZero` into the convolution and you get **zero-padding**: the image behaves as if it sits on an infinite black background, and the output comes back the same size as the input. Restrict the loop instead so it only ever visits pixels whose full neighbourhood exists, and you get **valid-only** convolution: no reader needs to do anything special at the edges, because the edges are simply never visited, and the output shrinks by one pixel on every side for a 3x3 kernel. Both are used throughout this project - same-size when you want to keep working with a full image, valid-only when you would rather lose the border than fabricate it.
