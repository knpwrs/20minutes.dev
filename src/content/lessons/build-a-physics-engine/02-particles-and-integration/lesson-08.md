---
project: build-a-physics-engine
lesson: 8
title: A body with position and velocity
overview: The simplest thing a physics engine simulates is a point that has a place and a motion. Today you build the Body type that carries a position and a velocity, the state every later lesson updates.
goal: Create a Body with a position and a velocity, both Vec2 values.
spec:
  scenario: A body holds its state
  status: failing
  lines:
    - kw: Given
      text: 'a new body at position {0, 0} with velocity {1, 2}'
    - kw: When
      text: its fields are read
    - kw: Then
      text: 'Position is {0, 0} and Velocity is {1, 2}'
code:
  lang: go
  source: |
    // a point mass for now; mass, shape, and rotation come later
    type Body struct {
      Position Vec2
      Velocity Vec2
    }
checkpoint: You have a Body that carries a position and a velocity. Commit and stop here.
---

A physics simulation is a set of **bodies**, each with **state** that changes over
time. The most basic state is where the body is (its **position**) and how fast and
which way it is going (its **velocity**), both 2D vectors. Right now a `Body` is a
bare point mass - no size, no mass, no spin - but this struct is the thing every
future lesson thickens: mass and inverse mass, restitution, a shape, an angle and an
angular velocity all get bolted on here.

Keep it a plain struct with exported fields so tests and later code can read and set
its state directly. Starting from a point that only knows where it is and where it
is heading keeps the first integration step - moving it by its velocity - as simple
as it can be.
