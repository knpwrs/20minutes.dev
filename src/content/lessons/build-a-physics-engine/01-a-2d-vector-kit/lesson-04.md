---
project: build-a-physics-engine
lesson: 4
title: The dot product
overview: The dot product measures how much two vectors point the same way, and it is the single most important scalar in collision response - it tells you the speed of approach along a contact normal. Today you build it.
goal: Compute the dot product of two vectors as the sum of their componentwise products.
spec:
  scenario: The dot product of two vectors
  status: failing
  lines:
    - kw: Given
      text: 'the vectors {1, 2} and {3, 4}'
    - kw: When
      text: their dot product is computed
    - kw: Then
      text: the result is 11
    - kw: And
      text: 'Dot({1, 0}, {0, 1}) is 0 (perpendicular) and Dot({2, 3}, {2, 3}) is 13'
code:
  lang: go
  source: |
    // sum of componentwise products: X*X + Y*Y
    func Dot(a, b Vec2) float64 { /* returns a scalar, not a vector */ }
checkpoint: You can take the dot product of two vectors. Commit and stop here.
---

The **dot product** collapses two vectors into a single number that measures how
aligned they are: large and positive when they point the same way, zero when they
are **perpendicular**, negative when they point against each other. That sign is
exactly what the collision solver needs later - a negative dot between a relative
velocity and a contact normal means two bodies are moving *into* each other, so an
impulse is required; a positive one means they are separating and should be left
alone.

Notice `Dot(v, v)` is the sum of the squares of the components - the squared length
of `v`, which the next lesson turns into an actual length. The perpendicular case
returning exactly `0` is the property that makes the dot product a test for "are
these at right angles", and it will matter when you project shapes onto axes for
collision detection.
