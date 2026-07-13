---
project: build-a-physics-engine
lesson: 3
title: Scaling by a scalar
overview: Integration multiplies a velocity by a timestep, and impulses multiply a normal by a magnitude, so scaling a vector by a single number is everywhere. Today you add Scale.
goal: Multiply a vector by a scalar, stretching both components by the same factor.
spec:
  scenario: Scaling a vector by a number
  status: failing
  lines:
    - kw: Given
      text: 'the vector {2, -3}'
    - kw: When
      text: it is scaled by 4
    - kw: Then
      text: 'the result is {8, -12}'
    - kw: And
      text: 'Scale(v, 0) is {0, 0} and Scale({1, 1}, -2) is {-2, -2}'
code:
  lang: go
  source: |
    // multiply both components by the same number
    func Scale(a Vec2, s float64) Vec2 { /* X * s, Y * s */ }
checkpoint: You can scale a vector by any number. Commit and stop here.
---

**Scaling** stretches or shrinks a vector by multiplying both components by one
number. It is the operation that turns "this velocity, for this much time" into a
displacement (`velocity` scaled by `dt`), and "this direction, this hard" into an
impulse (a unit normal scaled by a magnitude). Because it multiplies both
components by the same factor, the vector keeps its direction and only changes
length - unless the factor is negative, which also flips it around.

Nothing subtle here, but it is one of the three or four operations that the entire
integration and collision-response machinery is built from. Pin the `0` case
(scaling collapses any vector to the origin) and a negative factor (which reverses
direction) so the behavior is nailed down before code depends on it.
