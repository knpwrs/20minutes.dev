---
project: build-a-physics-engine
lesson: 25
title: Polygon edge normals
overview: The Separating Axis Theorem tests the directions a polygon's edges face, so first you need those outward normals. Today you compute them from counterclockwise vertices.
goal: Compute the outward unit normal of every edge of a counterclockwise polygon.
spec:
  scenario: The outward normals of a square
  status: failing
  lines:
    - kw: Given
      text: 'the counterclockwise square {-1, -1}, {1, -1}, {1, 1}, {-1, 1}'
    - kw: When
      text: its edge normals are computed
    - kw: Then
      text: 'they are {0, -1}, {1, 0}, {0, 1}, {-1, 0} in edge order (bottom, right, top, left)'
    - kw: And
      text: each normal is a unit vector pointing away from the polygon's interior
code:
  lang: go
  source: |
    // for a CCW polygon, the outward normal of edge (vi -> vi+1) is
    // the edge vector rotated clockwise: {edge.Y, -edge.X}, normalized
    func Normals(verts []Vec2) []Vec2 {
      out := make([]Vec2, len(verts))
      for i := range verts {
        edge := Sub(verts[(i+1)%len(verts)], verts[i])
        out[i] = Normalize(Vec2{edge.Y, -edge.X})
      }
      return out
    }
checkpoint: A polygon reports the outward normal of each edge. Commit and stop here.
---

The **Separating Axis Theorem** works by testing a handful of candidate directions,
and for a polygon those directions are the **outward normals** of its edges. Each
edge is the vector between two consecutive vertices; rotating that vector `90` degrees
clockwise gives a perpendicular, and because the vertices are wound
**counterclockwise**, that particular perpendicular always points *outward*, away from
the interior. The formula is a tidy `{edge.Y, -edge.X}`, normalized to unit length.

That counterclockwise winding you insisted on two lessons ago is what makes the sign
come out right without any per-polygon fiddling - reverse the winding and every normal
would point inward. For the unit square the four normals are exactly the axis
directions, which is the sanity check that the formula is correct. These normals are
the axes you will project shapes onto next.
