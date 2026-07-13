---
project: build-a-physics-engine
lesson: 30
title: One collision dispatcher
overview: The world should not care what shapes two bodies carry - it just asks "are these colliding?" Today you build the dispatcher that routes any body pair to the right test, closing the detection chapter.
goal: Route a pair of bodies to the correct shape-pair collision test based on their shapes, returning a manifold.
spec:
  scenario: Dispatching by shape type
  status: failing
  lines:
    - kw: Given
      text: 'two bodies carrying radius-1 circles at {0, 0} and {1.5, 0}, and two bodies carrying unit-square polygons at {0, 0} and {1.5, 0}'
    - kw: When
      text: Collide is called on each pair
    - kw: Then
      text: 'both pairs report normal {1, 0} and penetration 0.5, each routed to the matching test'
    - kw: And
      text: 'two far-apart circles routed through Collide report no collision'
code:
  lang: go
  source: |
    func Collide(a, b *Body) Manifold {
      switch sa := a.Shape.(type) {
      case Circle:
        if sb, ok := b.Shape.(Circle); ok {
          return CircleVsCircle(a.Position, sa.Radius, b.Position, sb.Radius)
        }
      case Polygon:
        if sb, ok := b.Shape.(Polygon); ok {
          return PolygonVsPolygon(worldVerts(a, sa), worldVerts(b, sb))
        }
      }
      // ... remaining pairs; worldVerts maps ToWorld over a polygon's vertices
    }
checkpoint: One Collide entry point routes any supported body pair to its test. Commit and stop here.
---

The detection functions each speak a different language - centers and radii, boxes,
vertex lists - but the world above them should only ever call one thing: `Collide(a, b)`,
handing over two bodies and getting back a manifold. The **dispatcher** bridges that gap
with a type switch on the two bodies' shapes, extracting the right geometry (a polygon's
world vertices come from mapping `ToWorld` over its local ones) and calling the matching
pair test. It is the seam where the polymorphic `Shape` interface pays off.

A couple of pairs reuse a test with the arguments swapped - a box versus a circle is
circle-versus-box with the normal flipped - and a box-versus-polygon case is a gap the
finalize pass can fill by treating the box as a polygon. Wiring the common pairs now
gives the world a single, shape-agnostic way to ask whether two bodies touch. Print a
few manifolds over a small scene to see the whole detection layer working end to end.
