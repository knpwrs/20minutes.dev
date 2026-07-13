---
project: build-a-physics-engine
lesson: 2
title: Subtraction and negation
overview: The vector from one point to another is their difference, so subtraction is how the engine will later find the direction between two bodies. Today you add Sub and Neg alongside yesterday's Add.
goal: Add subtraction of two vectors and negation of a single vector.
spec:
  scenario: Subtracting and negating vectors
  status: failing
  lines:
    - kw: Given
      text: 'the vectors {5, 7} and {1, 2}'
    - kw: When
      text: the second is subtracted from the first
    - kw: Then
      text: 'the result is {4, 5}'
    - kw: And
      text: 'Neg({3, -4}) is {-3, 4} and Sub(v, v) is {0, 0} for any v'
code:
  lang: go
  source: |
    // componentwise difference: a - b
    func Sub(a, b Vec2) Vec2 { /* X - X, Y - Y */ }
    // flip both components
    func Neg(a Vec2) Vec2 { /* -X, -Y */ }
checkpoint: You can subtract one vector from another and negate a vector. Commit and stop here.
---

**Subtraction** answers the question the engine asks constantly: given a body at
point `a` and another at point `b`, what is the vector that points from one to the
other? That direction-and-distance is exactly `Sub(b, a)`, and it is the seed of
every collision normal you will compute later. Like `Add`, it works componentwise
and returns a fresh vector.

**Negation** is the mirror operation - flipping a vector to point the opposite way,
which you will reach for when a force pushes one body one direction and its partner
the other. Pin the identity that a vector subtracted from itself is the **zero
vector** `{0, 0}`; that degenerate case (two bodies at the exact same spot) shows up
in real collision code, and getting it right now saves a surprise later.
