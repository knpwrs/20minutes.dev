---
project: build-a-physics-engine
lesson: 18
title: The box shape
overview: The second shape is an axis-aligned box, described by how far it reaches from its center along each axis. Today you build it and its bounding box, which for a box is itself.
goal: Define an axis-aligned box shape by its half-extents and compute its bounding box around a center.
spec:
  scenario: The bounds of an axis-aligned box
  status: failing
  lines:
    - kw: Given
      text: 'a box with half-extents {2, 1} centered at {0, 0}'
    - kw: When
      text: its bounding box is computed
    - kw: Then
      text: 'the box has Min {-2, -1} and Max {2, 1}'
    - kw: And
      text: 'the same box centered at {3, 0} has Min {1, -1} and Max {5, 1}'
code:
  lang: go
  source: |
    // half-extents: distance from center to an edge along each axis
    type Box struct{ HalfExtents Vec2 }
    func (bx Box) Bounds(center Vec2) AABB {
      return AABB{Min: Sub(center, bx.HalfExtents), Max: Add(center, bx.HalfExtents)}
    }
checkpoint: A box shape knows its bounding box. Commit and stop here.
---

An **axis-aligned box** is described by its **half-extents**: how far it reaches from
its center toward an edge along each axis. A box with half-extents `{2, 1}` is `4`
wide and `2` tall, spanning from `{-2, -1}` to `{2, 1}` around the origin. Storing
half-extents rather than a width and height makes the math symmetric - the corners are
just the center plus and minus the half-extents - which is why engines favor this
form.

For an axis-aligned box the bounding box *is* the box, so `Bounds` is trivial today.
It earns its own shape type because axis-aligned boxes collide with a fast, dedicated
overlap test you will write in the next chapter, without the general machinery that
rotated polygons need. Keep boxes upright for now; when you want a tilted rectangle,
that is the convex polygon coming two lessons from now.
