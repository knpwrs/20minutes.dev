---
project: build-a-physics-engine
lesson: 5
title: Length and length squared
overview: How far apart are two bodies? That is a vector length, the basis of the circle-circle collision test. Today you compute both the true length and the cheaper squared length.
goal: Compute a vector's length and its squared length.
spec:
  scenario: The magnitude of a vector
  status: failing
  lines:
    - kw: Given
      text: 'the vector {3, 4}'
    - kw: When
      text: its length and squared length are computed
    - kw: Then
      text: the length is 5 and the squared length is 25
    - kw: And
      text: 'Length({0, 0}) is 0 and LengthSquared({0, 0}) is 0'
code:
  lang: go
  source: |
    // squared length avoids the square root: X*X + Y*Y (this is Dot(a,a))
    func LengthSquared(a Vec2) float64 { /* ... */ }
    // true length is the square root of that
    func Length(a Vec2) float64 { /* math.Sqrt(LengthSquared(a)) */ }
checkpoint: You can measure how long a vector is. Commit and stop here.
---

A vector's **length** (its magnitude) is the straight-line distance from the origin
to its tip, given by the Pythagorean theorem: the square root of the sum of the
squared components. For `{3, 4}` that is the square root of `9 + 16 = 25`, which is
exactly `5`. This is how the engine will later measure the gap between two circle
centers to decide whether they touch.

Provide **`LengthSquared`** too, and reach for it whenever you can. The square root
is comparatively expensive, and most tests only compare a distance against a
threshold - and if `a < b` for non-negative numbers then `a*a < b*b`, so comparing
squared distances gives the same answer without the root. Notice `LengthSquared` is
just `Dot(a, a)`, reusing yesterday's operation.
