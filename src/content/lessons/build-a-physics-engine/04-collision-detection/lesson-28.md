---
project: build-a-physics-engine
lesson: 28
title: Polygon versus polygon
overview: 'Now the pieces combine: test every edge normal of both polygons, and if none separates them, the shallowest overlap is the contact. Today you build full polygon-polygon SAT.'
goal: Detect collision between two convex polygons and return the minimum-penetration axis as the manifold.
spec:
  scenario: Two squares overlapping
  status: failing
  lines:
    - kw: Given
      text: 'the unit square at the origin and the same square translated to center {1.5, 0}'
    - kw: When
      text: they are tested for collision with SAT
    - kw: Then
      text: 'they collide with normal {1, 0} and penetration 0.5'
    - kw: And
      text: 'when the second square is at center {3, 0} there is a separating axis and no collision'
code:
  lang: go
  source: |
    func PolygonVsPolygon(a, b []Vec2) Manifold {
      best := math.Inf(1)
      var normal Vec2
      for _, axis := range append(Normals(a), Normals(b)...) {
        o := Overlap(Project(a, axis), Project(b, axis))
        if o <= 0 { return Manifold{} } // separating axis found
        if o < best { best, normal = o, axis }
      }
      // flip normal to point from A's center toward B's center; penetration = best
    }
checkpoint: Two convex polygons collide via SAT, reporting the shallowest-penetration normal. Commit and stop here.
---

Full **SAT** for two convex polygons is the assembly of the last three lessons: the
only axes that can separate them are the **edge normals** of the two shapes, so you
project both polygons onto each candidate normal and measure the overlap. The instant
any axis shows a gap, you return "no collision" - most non-colliding pairs bail out on
the first or second axis, which is what makes SAT fast. If every axis overlaps, the
shapes intersect.

Among all those overlaps, the **smallest** one is the shortest distance you would have
to push the shapes to separate them, so its axis is the contact normal and its size is
the penetration. One detail: an edge normal points outward from *its own* polygon, so
flip it if needed to point consistently from A toward B, comparing the shape centers.
Two overlapping unit squares separate along x with penetration `0.5`. This one function
handles every convex polygon pair, rotated or not.
