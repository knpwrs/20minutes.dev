---
project: build-an-stt-model
lesson: 15
title: Distance between two frames
overview: Matching a spoken word against a template starts with one small question - how far apart are two frames? Today you build the single distance function every comparison in this chapter calls.
goal: Implement squared Euclidean distance between two frames, scalar or vector, and confirm it against two pinned pairs.
spec:
  scenario: Measuring the distance between two frames
  status: failing
  lines:
    - kw: Given
      text: 'two scalar frames holding the single values 1.0 and 3.0, and two 2-dimensional frames holding [1, 2] and [3, 0]'
    - kw: When
      text: 'the squared distance is computed between the two scalar frames'
    - kw: Then
      text: 'the distance is 4.0 - the square of their difference, 3.0 minus 1.0'
    - kw: When
      text: 'the squared distance is computed between the two vector frames'
    - kw: Then
      text: 'the distance is 8.0 - the sum of the squared difference in each dimension: (1-3) squared plus (2-0) squared, 4 plus 4'
code:
  lang: go
  source: |
    // squared distance: sum over dimensions of (a[i]-b[i])^2 - a scalar frame
    // is just the dim-1 case, no special-casing needed
    func FrameDistance(a, b []float64) float64 {
      s := 0.0
      for i := range a {
        d := a[i] - b[i]
        s += d * d
      }
      return s
    }
checkpoint: You have one distance function every later comparison in this chapter calls, on frames of any size. Commit and stop for today.
---

Recognizing a spoken word by matching it against a stored template starts with the smallest possible question: how far apart are two individual frames? **Squared Euclidean distance** answers it the same way whether a frame is one number (a single MFCC coefficient, or a toy scalar feature) or several - subtract, square, and if there is more than one dimension, add the squares together. There is no separate "vector" formula; a scalar is simply a vector of length one, which is why today's spec checks both shapes with exactly the same function.

This one number is the whole foundation the next few lessons are built on. Dynamic time warping, coming up in lesson 16, does nothing more exotic than adding up a lot of these distances along the cheapest possible path between two sequences - so it is worth having this function feel completely unsurprising before anything gets stitched together on top of it.
