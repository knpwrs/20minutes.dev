---
project: build-a-bloom-filter
lesson: 19
title: Sizing width and depth
overview: The width controls how much a Count-Min estimate can overshoot, and the depth controls how likely a bad overshoot is. Both come from a target error and confidence. Today you compute the grid dimensions.
goal: Compute the sketch width w and depth d from a target error epsilon and failure probability delta.
spec:
  scenario: Grid dimensions from an error target
  status: failing
  lines:
    - kw: Given
      text: 'the rules w = ceil(e / epsilon) and d = ceil(ln(1 / delta)), where an estimate overshoots the true count by at most epsilon times the stream length with probability at least 1 minus delta'
    - kw: When
      text: 'dimensions are computed for epsilon = 0.1 and delta = 0.01'
    - kw: Then
      text: 'w is 28 and d is 5'
    - kw: And
      text: 'for epsilon = 0.01 and delta = 0.01, w is 272 and d is 5'
code:
  lang: go
  source: |
    func Dimensions(epsilon, delta float64) (w, d int) {
      w = int(math.Ceil(math.E / epsilon))     // wider -> smaller overshoot
      d = int(math.Ceil(math.Log(1 / delta)))  // deeper -> more reliable
      return
    }
checkpoint: You can size a Count-Min sketch for a target error and confidence. Commit and stop here.
---

The two dimensions of the grid control two different things. The **width** `w` bounds how large the over-count can be: with more columns, fewer items collide in any given row, and the guarantee is that an estimate exceeds the truth by at most `epsilon * N` (where `N` is the total number of additions) once `w = ceil(e / epsilon)`. Halving the allowed error `epsilon` doubles the width.

The **depth** `d` controls how often that bound might fail. Each extra row is another independent shot at a collision-free counter, so the failure probability shrinks geometrically, and `d = ceil(ln(1 / delta))` pins it below `delta`. Notice how cheap confidence is: driving the failure probability from one percent to a hundredth of a percent moves `d` from `5` to about `9`, while tightening the error ten-fold multiplies the width by ten. That asymmetry - pay linearly for accuracy, logarithmically for confidence - is the same shape you saw in the Bloom filter, and it is what makes these sketches practical.
