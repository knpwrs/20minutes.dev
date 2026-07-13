---
project: build-a-physics-engine
lesson: 20
title: Rotating a shape into the world
overview: A polygon is stored around its own origin, but bodies sit and spin somewhere in the world. Today you give a body an angle and transform a local vertex into world space by rotating then translating.
goal: Add an orientation to a body and map a shape's local vertex into world space.
spec:
  scenario: Transforming a local point to world space
  status: failing
  lines:
    - kw: Given
      text: 'a body at position {5, 5} with angle pi/2 (a quarter turn counterclockwise)'
    - kw: When
      text: 'the local vertex {1, 0} is transformed into world space'
    - kw: Then
      text: 'the world point is {5, 6} (within 1e-9)'
    - kw: And
      text: 'the local vertex {0, 1} maps to {4, 5}, and with angle 0 the vertex {1, 0} maps to {6, 5}'
code:
  lang: go
  source: |
    // add an Angle float64 field to Body
    func Rotate(v Vec2, angle float64) Vec2 {
      c, s := math.Cos(angle), math.Sin(angle)
      // standard 2D rotation matrix applied to v
      return Vec2{v.X*c - v.Y*s, v.X*s + v.Y*c}
    }
    // world = rotate the local point by the body's angle, then translate by position
    func (b *Body) ToWorld(local Vec2) Vec2 { return Add(Rotate(local, b.Angle), b.Position) }
checkpoint: A body has an orientation and can place its shape's vertices in the world. Commit and stop here.
---

So far bodies only had a position; a rigid body also has an **orientation**, an angle
it is turned to. A shape's vertices are stored in its own **local space**, centered on
the origin and unrotated, which keeps the shape definition simple and reusable. To find
where a vertex actually is in the world, you apply the body's transform: **rotate** the
local point by the body's angle, then **translate** it by the body's position. Order
matters - rotate first, around the origin, then move.

Rotation uses the standard 2D rotation matrix, which for a quarter turn
(`pi/2`) sends `{1, 0}` to `{0, 1}`. Because trigonometry brings in irrational values,
compare rotated results with a small **tolerance** rather than for exact equality - a
habit for every rotation test from here on. This `ToWorld` transform is what lets the
collision code in the next chapter reason about polygons wherever they sit and however
they are turned.
