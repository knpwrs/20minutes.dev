---
project: build-a-physics-engine
lesson: 19
title: The convex polygon shape
overview: The general shape is a convex polygon - a list of corners wound counterclockwise. Today you build it and its bounding box, the foundation for the Separating Axis Theorem later.
goal: Define a convex polygon by its counterclockwise vertices and compute its bounding box.
spec:
  scenario: The bounds of a convex polygon
  status: failing
  lines:
    - kw: Given
      text: 'a polygon with vertices {-1, -1}, {1, -1}, {1, 1}, {-1, 1} (a unit square, counterclockwise)'
    - kw: When
      text: its bounding box is computed
    - kw: Then
      text: 'the box has Min {-1, -1} and Max {1, 1}'
    - kw: And
      text: 'a triangle {0, 2}, {-1, -1}, {1, -1} has Min {-1, -1} and Max {1, 2}'
code:
  lang: go
  source: |
    type Polygon struct{ Vertices []Vec2 } // counterclockwise, local space
    func (p Polygon) Bounds(center Vec2) AABB {
      min, max := p.Vertices[0], p.Vertices[0]
      for _, v := range p.Vertices[1:] {
        // widen min/max to include each vertex (offset by center)
      }
      // return AABB offset by center
    }
checkpoint: A convex polygon knows its bounding box. Commit and stop here.
---

A **convex polygon** is the general shape: any triangle, rectangle, pentagon, or
tilted box, stored as a list of **vertices**. Two conventions make the later math
clean. First, keep them **convex** - no dents - because the Separating Axis Theorem
you will use for collisions only works on convex shapes. Second, wind them
**counterclockwise**, so that the outward-facing normal of each edge can be computed
with a consistent formula in the next chapter.

The bounding box of a polygon is found by sweeping over its vertices and tracking the
smallest and largest X and Y seen - the tightest upright rectangle that contains them
all. Store the vertices in the shape's own **local space** (centered on the origin);
the center passed in offsets them into the world, and a later lesson will also rotate
them by the body's angle. For now an unrotated square from `{-1, -1}` to `{1, 1}`
bounds exactly to itself.
