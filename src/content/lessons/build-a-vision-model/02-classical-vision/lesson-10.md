---
project: build-a-vision-model
lesson: 10
title: Sobel gradients
overview: A gradient measures how fast brightness changes at a pixel, but change has a direction. Today you build the two Sobel kernels that measure it, one for left-right change and one for top-bottom, because they are the same idea, a directional gradient, just rotated a quarter turn.
goal: Build the SobelX and SobelY kernels and confirm the sign convention each one uses on a vertical edge, where only one of the two should see anything at all.
spec:
  scenario: Two directional gradients on a vertical edge
  status: failing
  lines:
    - kw: Given
      text: 'the 5 by 5 vertical-edge image from lesson 8 (10 in the left three columns, 200 in the right two)'
    - kw: And
      text: 'the SobelX kernel, rows -1 0 1, -2 0 2, -1 0 1, and the SobelY kernel, rows -1 -2 -1, 0 0 0, 1 2 1'
    - kw: When
      text: 'SobelX is convolved over the image with no padding (valid-only, lesson 7)'
    - kw: Then
      text: 'the output is 3 by 3, and its middle and right columns are both 760 - a positive value, meaning the image gets brighter moving left to right there'
    - kw: And
      text: 'the left column of that output is 0, since three 10s in a row have no left-right change to detect'
    - kw: When
      text: SobelY is convolved over the same image, also valid-only
    - kw: Then
      text: every value in its output is 0 - a purely vertical edge has no top-to-bottom change anywhere
code:
  lang: go
  source: |
    // SobelX reads left-right change, SobelY reads top-bottom change - same
    // valid-only convolution as lesson 7, just a different kernel each time
    sobelX := [3][3]float64{{-1, 0, 1}, {-2, 0, 2}, {-1, 0, 1}}
    sobelY := [3][3]float64{{-1, -2, -1}, {0, 0, 0}, {1, 2, 1}}
    Convolve3x3Valid(img, sobelX)
    Convolve3x3Valid(img, sobelY)
checkpoint: You have both Sobel kernels working, with the sign convention pinned - positive SobelX means brighter to the right - and confirmed a purely vertical edge produces nothing at all from SobelY. Commit and stop for today.
---

A **gradient** at a pixel says how fast brightness is changing there, and unlike lesson 6's difference kernel, direction matters: a photograph can brighten moving right while staying flat moving down. SobelX and SobelY are the same idea built twice, one rotated 90 degrees from the other - each is still a 3x3 correlation, just weighted to pick out change along one axis while cancelling the other out.

The sign is worth fixing now, because it decides which way "positive" points for the rest of the project: a positive SobelX output means the image is brighter to the right of that pixel than to the left, and a positive SobelY means brighter below than above. Run both across today's vertical edge and the split is clean - SobelX lights up wherever the edge sits, and SobelY reports exactly zero everywhere, because there is no row-to-row change anywhere in a purely vertical edge for it to find.
