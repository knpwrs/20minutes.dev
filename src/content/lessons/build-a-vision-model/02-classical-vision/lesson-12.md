---
project: build-a-vision-model
lesson: 12
title: Thresholding
overview: 'A gradient magnitude map is still a range of numbers, useful for arithmetic but hard to read at a glance. Today you collapse it to a binary mask: a hard cutoff that answers edge or not-edge for every pixel, nothing in between.'
goal: Threshold the gradient magnitude grid from lesson 11 at t=100, mapping every pixel to exactly 0 or 255.
spec:
  scenario: A binary edge mask
  status: failing
  lines:
    - kw: Given
      text: 'the gradient magnitude grid from lesson 11, whose values are either 0 or 760, and a threshold t of 100'
    - kw: When
      text: 'each value is compared against t: a value of 100 or higher becomes 255, anything lower becomes 0'
    - kw: Then
      text: every 760 becomes 255
    - kw: And
      text: every 0 stays 0
code:
  lang: go
  source: |
    // meet the cutoff or beat it and the pixel counts as an edge
    func threshold(v, t float64) uint8 {
      if v >= t {
        return 255
      }
      return 0
    }
checkpoint: Your gradient map is now a binary edge mask, exactly 0 or 255 everywhere, ready to overlay on the original image or count directly. Commit and stop for today.
---

Every filter so far has produced a number for each pixel - a blurred value, a gradient, a magnitude - but a downstream step often just wants a yes-or-no answer: is this pixel part of an edge? A **threshold** turns any single continuous map into that answer by picking one cutoff value `t` and asking, independently at every pixel, whether the value clears it.

The direction of the comparison is the one detail worth being precise about: a value exactly equal to `t` counts as over the threshold, not under it, which matters whenever your data lands exactly on the boundary rather than comfortably on one side of it. Past this point every image in the pipeline is binary - just 0 and 255 - which is exactly the shape a downstream step like counting edge pixels, drawing outlines, or overlaying a mask wants.
