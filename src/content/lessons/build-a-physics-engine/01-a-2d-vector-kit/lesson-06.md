---
project: build-a-physics-engine
lesson: 6
title: Normalizing to a unit vector
overview: A contact normal is a pure direction with length one, so the engine needs to strip the length off a vector and keep only its direction. Today you build Normalize, including the zero-length case that would otherwise divide by zero.
goal: Turn a vector into a unit-length vector pointing the same way, with a safe result for the zero vector.
spec:
  scenario: Producing a unit vector
  status: failing
  lines:
    - kw: Given
      text: 'the vector {3, 4}'
    - kw: When
      text: it is normalized
    - kw: Then
      text: 'the result is {0.6, 0.8} and its length is 1'
    - kw: And
      text: 'Normalize({0, 5}) is {0, 1}, and Normalize({0, 0}) is {0, 0} (no divide by zero)'
code:
  lang: go
  source: |
    func Normalize(a Vec2) Vec2 {
      len := Length(a)
      // guard the zero vector: length 0 has no direction, return {0,0}
      if len == 0 { return Vec2{} }
      // divide both components by the length
      return Scale(a, 1/len)
    }
checkpoint: You can produce a unit-length direction from any vector. Commit and stop here.
---

A **unit vector** has length exactly `1`, so it carries a direction and nothing
else. **Normalizing** divides a vector by its own length, shrinking or growing it to
that unit length while preserving its heading. Every contact normal, every axis you
test for separation, is a unit vector - the resolution math assumes it, because an
impulse scaled by a normal that is not unit length would come out the wrong size.

The one trap is the **zero vector**: it has length `0` and therefore no direction,
and dividing by that length is a division by zero that yields infinities or NaN.
Two bodies resting at the exact same point can hand you a zero direction, so guard
it explicitly and return `{0, 0}`. Pinning that case now means the collision code
downstream never has to defend against a poisoned normal.
