---
project: build-a-physics-engine
lesson: 27
title: Overlap along an axis
overview: Two shadows on an axis either overlap by some amount or leave a gap that proves the shapes are apart. Today you measure that overlap, the decision the whole SAT rests on.
goal: Compute how much two intervals overlap, where a non-positive result means a separating gap.
spec:
  scenario: Measuring interval overlap
  status: failing
  lines:
    - kw: Given
      text: 'the intervals [-1, 1] and [0.5, 3]'
    - kw: When
      text: their overlap is computed
    - kw: Then
      text: the overlap is 0.5
    - kw: And
      text: '[-1, 1] and [2, 4] give overlap -1 (a gap, so a separating axis)'
code:
  lang: go
  source: |
    // positive: overlap amount; zero or negative: a gap of that size
    func Overlap(a, b Interval) float64 {
      return math.Min(a.Max, b.Max) - math.Max(a.Min, b.Min)
    }
checkpoint: You can measure the overlap of two intervals and detect a separating gap. Commit and stop here.
---

Given two intervals on the same axis, they **overlap** from the larger of their two
minimums to the smaller of their two maximums; the length of that span is
`min(maxes) - max(mins)`. When that comes out positive the shadows overlap by that
amount. When it comes out zero or negative, there is a **gap**: the shapes do not touch
along this axis, and that single fact is enough to conclude they do not collide at all.

That is the heart of the **Separating Axis Theorem**: if you can find even one axis where
the projections leave a gap, the shapes are provably separated and you can stop. If every
candidate axis shows an overlap, they intersect, and the axis with the *smallest* overlap
is the direction of shallowest penetration - the contact normal. The next lesson runs
this over all of two polygons' edge normals to produce a full manifold.
