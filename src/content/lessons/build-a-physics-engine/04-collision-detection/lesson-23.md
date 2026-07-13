---
project: build-a-physics-engine
lesson: 23
title: Box versus box
overview: Two axis-aligned boxes overlap when they overlap on both axes, and the shallowest of those overlaps tells you which way to push them apart. Today you build that test.
goal: Detect overlap between two axis-aligned boxes and return the minimum-penetration axis as the manifold.
spec:
  scenario: Two axis-aligned boxes overlapping
  status: failing
  lines:
    - kw: Given
      text: 'box A from {0, 0} to {2, 2} and box B from {1, 0} to {3, 2}'
    - kw: When
      text: they are tested for collision
    - kw: Then
      text: 'they collide with normal {1, 0} and penetration 1 (the shallower axis)'
    - kw: And
      text: 'box A and a box from {3, 0} to {5, 2} do not collide (no overlap on the x axis)'
code:
  lang: go
  source: |
    func AABBvsAABB(a, b AABB) Manifold {
      // overlap on each axis: min(maxes) - max(mins)
      ox := math.Min(a.Max.X, b.Max.X) - math.Max(a.Min.X, b.Min.X)
      oy := math.Min(a.Max.Y, b.Max.Y) - math.Max(a.Min.Y, b.Min.Y)
      if ox <= 0 || oy <= 0 { return Manifold{} } // separated on some axis
      // pick the smaller overlap as the axis; normal points A -> B along it
    }
checkpoint: Two boxes report the shallowest overlap axis as their contact normal. Commit and stop here.
---

Two **axis-aligned boxes** overlap only if they overlap on *both* the x and y axes at
once - if there is any gap on either axis, they are apart. On each axis the overlap is
`min(maxes) - max(mins)`; a non-positive result on either axis means no collision. This
is the Separating Axis Theorem in its simplest form, specialized to the two axes a box
is aligned with.

When they do overlap, the box wants to be pushed out the **cheapest** way - along the
axis with the *smaller* overlap, because that is the shortest move that separates them.
That shallower overlap is the penetration, and the normal points along that axis from A
toward B (compare the box centers to pick the sign). Here the x overlap is `1` and the y
overlap is `2`, so the boxes separate along x with penetration `1`. Choosing the minimum
axis is the same idea you will generalize to arbitrary polygons with full SAT.
