---
project: build-a-physics-engine
lesson: 26
title: Projecting a shape onto an axis
overview: To test whether two shapes are separated along a direction, you flatten each onto that direction and get an interval. Today you build that projection.
goal: Project a polygon's vertices onto an axis and return the min and max of the shadow interval.
spec:
  scenario: The shadow of a square on an axis
  status: failing
  lines:
    - kw: Given
      text: 'the unit square {-1, -1}, {1, -1}, {1, 1}, {-1, 1}'
    - kw: When
      text: 'it is projected onto the axis {1, 0}'
    - kw: Then
      text: 'the interval is Min -1, Max 1'
    - kw: And
      text: 'projected onto the unit diagonal axis {0.7071, 0.7071} the interval is about Min -1.4142, Max 1.4142 (to 4 places)'
code:
  lang: go
  source: |
    type Interval struct{ Min, Max float64 }
    func Project(verts []Vec2, axis Vec2) Interval {
      d := Dot(verts[0], axis)
      iv := Interval{d, d}
      for _, v := range verts[1:] {
        p := Dot(v, axis) // scalar position along the axis
        // widen iv.Min / iv.Max to include p
      }
      return iv
    }
checkpoint: A polygon projects onto any axis as a min-max interval. Commit and stop here.
---

To decide whether two shapes are separated along some direction, you **project** each
onto that direction: take the dot product of every vertex with the axis, which gives
each vertex's position along it, and keep the smallest and largest. That min-max pair
is the shape's **shadow** on the axis - a 1D interval standing in for the whole 2D
shape as seen from that direction. Using a **unit** axis keeps those numbers as real
distances.

This reduces a hard 2D question to an easy 1D one: two intervals either overlap or they
do not. The square's shadow on the x axis runs from `-1` to `1`, and on the diagonal it
stretches to the corner distance, about `1.4142`. The next lesson compares two such
intervals to detect a gap; project both shapes onto every candidate axis and you have
the full Separating Axis Theorem.
