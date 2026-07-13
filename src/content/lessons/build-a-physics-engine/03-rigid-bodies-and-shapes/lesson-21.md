---
project: build-a-physics-engine
lesson: 21
title: A shape interface
overview: Circles, boxes, and polygons all need to answer the same questions, so today you unify them behind one Shape interface that returns a world-space bounding box - and attach a shape to a body.
goal: Define a Shape interface with a world-bounds method that every shape implements, and give a body a shape.
spec:
  scenario: World bounds through a common interface
  status: failing
  lines:
    - kw: Given
      text: 'a body at {5, 5} carrying a circle of radius 2, and a body at {3, 0} carrying the unit-square polygon'
    - kw: When
      text: each body is asked for its shape's world bounds through the Shape interface
    - kw: Then
      text: 'the circle body reports Min {3, 3}, Max {7, 7} and the polygon body reports Min {2, -1}, Max {4, 1}'
    - kw: And
      text: 'both are reached through the same Shape.WorldBounds call, not shape-specific code'
code:
  lang: go
  source: |
    type Shape interface{ WorldBounds(b *Body) AABB }
    func (c Circle) WorldBounds(b *Body) AABB { return c.Bounds(b.Position) }
    func (p Polygon) WorldBounds(b *Body) AABB {
      // transform each vertex with b.ToWorld, then take the min/max
    }
    // add a Shape field to Body
checkpoint: Every shape reports its world bounds through one interface, and bodies carry shapes. Commit and stop here.
---

Different shapes need different collision math, but the engine wants to treat them
uniformly for the things they have in common - first among them, reporting a
world-space bounding box for the broadphase. A Go **interface** captures that: `Shape`
declares a `WorldBounds` method, and `Circle`, `Box`, and `Polygon` each implement it
their own way. A circle's world box is just its center bounds (rotation cannot change
a circle); a polygon's requires transforming every vertex into the world first, then
taking the extremes.

Attach a `Shape` to the `Body` so a body finally has both physical state and a form.
This is the **polymorphism** the rest of the engine leans on: the broadphase and the
collision dispatcher can hold a `Shape` without caring which kind it is. Wiring the
interface up now - with a single implementation each - means every collision lesson to
come is a pure addition rather than a refactor. Printing each body's world bounds gives
a small scene-inspection demo to close the chapter.
