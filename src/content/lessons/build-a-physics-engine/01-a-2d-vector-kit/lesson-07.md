---
project: build-a-physics-engine
lesson: 7
title: The 2D cross product
overview: In 2D the cross product is a single number that measures signed area and turning, and it is the term that later couples a contact point to a body's spin. Today you add it and close out the vector kit.
goal: Compute the 2D scalar cross product of two vectors.
spec:
  scenario: The scalar cross product
  status: failing
  lines:
    - kw: Given
      text: 'the vectors {2, 3} and {4, 5}'
    - kw: When
      text: their cross product is computed
    - kw: Then
      text: the result is -2
    - kw: And
      text: 'Cross({1, 0}, {0, 1}) is 1 and Cross({1, 2}, {2, 4}) is 0 (parallel)'
code:
  lang: go
  source: |
    // 2D cross is a scalar: X*Y' - Y*X'  (the z of the 3D cross)
    func Cross(a, b Vec2) float64 { /* a.X*b.Y - a.Y*b.X */ }
checkpoint: 'Your vector kit is complete - add, subtract, scale, dot, length, normalize, and cross. Commit and stop here.'
---

The three-dimensional cross product returns a vector, but for two vectors lying in
the plane that result only ever points along the z axis, so in 2D we keep just that
one number: `a.X*b.Y - a.Y*b.X`. It is the **signed area** of the parallelogram the
two vectors span - positive when `b` is counterclockwise from `a`, negative when
clockwise, and exactly `0` when they are **parallel**. That parallel test and the
sign are why it appears when you compute outward polygon normals and, most
importantly, when a contact off to one side of a body's center produces a **torque**
that makes it spin.

That completes the math kit the whole engine rides on. You can now build vectors,
combine them, measure them, and reduce them to pure directions and signed areas -
every physical quantity from here on is expressed in these seven operations. With
`Add`, `Dot`, and `Cross` you can already sanity-check the kit by printing a few
results before moving on to motion.
