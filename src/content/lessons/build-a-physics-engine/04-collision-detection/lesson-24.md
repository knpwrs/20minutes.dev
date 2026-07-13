---
project: build-a-physics-engine
lesson: 24
title: Circle versus box
overview: A circle hits a box wherever the box is closest to the circle's center. Today you find that closest point and turn it into a manifold, the first mixed-shape collision.
goal: Detect a circle overlapping an axis-aligned box using the closest point on the box to the circle's center.
spec:
  scenario: A circle touching the side of a box
  status: failing
  lines:
    - kw: Given
      text: 'a box from {-1, -1} to {1, 1} and a circle of radius 1 centered at {1.5, 0}'
    - kw: When
      text: they are tested for collision
    - kw: Then
      text: 'they collide with normal {1, 0} and penetration 0.5'
    - kw: And
      text: 'the same circle centered at {3, 0} does not collide (closest point {1, 0} is distance 2 away, beyond the radius)'
code:
  lang: go
  source: |
    func clamp(v, lo, hi float64) float64 { return math.Max(lo, math.Min(hi, v)) }
    func CircleVsBox(box AABB, center Vec2, r float64) Manifold {
      // closest point on the box to the center, per axis
      closest := Vec2{clamp(center.X, box.Min.X, box.Max.X), clamp(center.Y, box.Min.Y, box.Max.Y)}
      d := Sub(center, closest)
      if LengthSquared(d) >= r*r { return Manifold{} }
      // normal from box toward circle, penetration = r - distance
    }
checkpoint: A circle and a box report their collision through the closest point. Commit and stop here.
---

A circle collides with a box exactly when the **closest point on the box** to the
circle's center lies within one radius. Finding that point is easy for an axis-aligned
box: **clamp** the center's coordinates into the box's range on each axis. If the
center is off to the right, the closest point sits on the right edge; the vector from
it back to the center is the contact direction, and its length compared to the radius
tells you whether they touch.

When they overlap, the penetration is the radius minus that distance, and the normal is
the direction from the closest point to the center, pointing from the box toward the
circle. One case needs care: if the center is **inside** the box, the clamp returns the
center itself and the direction degenerates to zero, so that situation must be handled
by pushing out along the nearest face instead. The pinned cases keep the center outside;
the inside case is the kind of robustness gap the finalize pass hardens.
