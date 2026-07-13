---
project: build-a-physics-engine
lesson: 29
title: Circle versus polygon
overview: A circle against a polygon is SAT with one extra axis - the direction from the nearest corner - so corners are handled as well as faces. Today you build the last shape pair.
goal: Detect a circle overlapping a convex polygon using the polygon's normals plus the nearest-vertex axis.
spec:
  scenario: A circle touching a polygon face
  status: failing
  lines:
    - kw: Given
      text: 'the unit square at the origin and a circle of radius 1 centered at {1.5, 0}'
    - kw: When
      text: they are tested for collision
    - kw: Then
      text: 'they collide with normal {1, 0} and penetration 0.5'
    - kw: And
      text: 'the same circle centered at {3, 0} does not collide (a separating axis exists)'
code:
  lang: go
  source: |
    func projectCircle(center Vec2, r float64, axis Vec2) Interval {
      d := Dot(center, axis)
      return Interval{d - r, d + r}
    }
    // axes = polygon Normals, plus Normalize(center - nearestVertex).
    // Overlap circle-vs-polygon on each; any gap -> no collision;
    // smallest overlap -> normal (flipped toward the circle) + penetration.
checkpoint: A circle and a convex polygon collide via SAT, and every shape pair is now covered. Commit and stop here.
---

A circle has no edges, so it contributes no face normals to SAT - but there is still a
direction that can separate a circle from a polygon that none of the polygon's own
normals cover: the line from the circle's center to the **nearest vertex**. Add that one
axis to the polygon's edge normals, project the circle (its shadow on any axis is just
its center's dot product plus and minus the radius), and run the same overlap test as
before.

That extra axis is what makes a circle rolling off a **corner** of a polygon behave
correctly instead of snapping to a face. For a circle pressing flat against a side, the
face normal still wins as the shallowest overlap, giving normal `{1, 0}` and penetration
`0.5` here. With this pair done, the engine can now detect a contact between any two of
its shapes - circles, boxes, and polygons in every combination. The next lesson wires
them together behind one dispatcher.
