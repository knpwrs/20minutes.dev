---
project: build-a-physics-engine
lesson: 17
title: The circle shape and its bounding box
overview: A body needs a shape to collide. The simplest is a circle, and the cheapest thing you can ask of any shape is its axis-aligned bounding box. Today you build both.
goal: Define a circle shape and compute its axis-aligned bounding box around a center.
spec:
  scenario: The bounding box of a circle
  status: failing
  lines:
    - kw: Given
      text: 'a circle of radius 2 centered at {5, 5}'
    - kw: When
      text: its axis-aligned bounding box is computed
    - kw: Then
      text: 'the box has Min {3, 3} and Max {7, 7}'
    - kw: And
      text: 'a circle of radius 1 at {0, 0} has Min {-1, -1} and Max {1, 1}'
code:
  lang: go
  source: |
    type AABB struct{ Min, Max Vec2 }
    type Circle struct{ Radius float64 }
    // the box just fits the circle: center plus and minus the radius
    func (c Circle) Bounds(center Vec2) AABB {
      r := Vec2{c.Radius, c.Radius}
      return AABB{Min: Sub(center, r), Max: Add(center, r)}
    }
checkpoint: A circle knows its bounding box. Commit and stop here.
---

A **circle** is the friendliest shape in a physics engine - it is the same from every
angle, so it has no rotation to worry about, and its collision tests are pure distance
checks. All it needs is a **radius**; its center is wherever the body sits. Define the
`Circle` type now, and it becomes the first thing a body can actually collide with.

Every shape also needs to report an **axis-aligned bounding box** (AABB): the smallest
upright rectangle that fully contains it, described by its minimum and maximum corners.
For a circle that is simply the center plus and minus the radius in each direction.
Bounding boxes are what the broadphase will use later to reject pairs that cannot
possibly be touching, cheaply, before running the exact test - so giving every shape a
`Bounds` is the foundation of making collision detection fast.
