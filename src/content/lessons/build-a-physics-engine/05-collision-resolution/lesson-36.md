---
project: build-a-physics-engine
lesson: 36
title: Moment of inertia
overview: Rotation has its own kind of mass - how hard a shape is to spin - called the moment of inertia. Today you compute it for a circle and a box, opening the door to spinning bodies.
goal: Compute a body's moment of inertia from its shape and mass, and its inverse, with zero for a static body.
spec:
  scenario: The rotational inertia of shapes
  status: failing
  lines:
    - kw: Given
      text: 'a circle of radius 1 with mass 2, and a box with half-extents {1, 1} and mass 1'
    - kw: When
      text: each body's moment of inertia is computed
    - kw: Then
      text: 'the circle has inertia 1 (inverse inertia 1) and the box has inertia 0.6667 (inverse inertia 1.5)'
    - kw: And
      text: 'a static body (mass 0) has inverse inertia 0, so no torque can spin it'
code:
  lang: go
  source: |
    func (c Circle) Inertia(m float64) float64 { return 0.5 * m * c.Radius * c.Radius }
    func (bx Box) Inertia(m float64) float64 {
      // full width w = 2*hx, height h = 2*hy; I = m*(w^2 + h^2)/12
      hx, hy := bx.HalfExtents.X, bx.HalfExtents.Y
      return m * (hx*hx + hy*hy) / 3
    }
    // set Inertia from the shape, InvInertia = 1/Inertia (0 if inertia is 0)
checkpoint: Bodies know their moment of inertia and inverse inertia. Commit and stop here.
---

Just as mass measures resistance to being pushed, the **moment of inertia** measures
resistance to being **spun**. It depends on both how much mass a shape has and how that
mass is spread out from the center - mass far from the center is harder to rotate. Each
shape has its own formula: a solid disc is `0.5 * m * r^2`, and a rectangle is
`m * (w^2 + h^2) / 12` for full width `w` and height `h`. These give the box here an
inertia of two-thirds.

Store the **inverse inertia** for the same reason you stored inverse mass: rotation math
divides by it constantly, and a static body gets inverse inertia `0`, meaning infinite
rotational inertia - no torque will ever spin it. That mirror of the static rule keeps
walls and floors perfectly rigid in rotation too. With inertia in hand, the next lessons
give bodies an angular velocity and let off-center contacts make them turn.
