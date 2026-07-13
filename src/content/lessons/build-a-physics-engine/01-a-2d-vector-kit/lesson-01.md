---
project: build-a-physics-engine
lesson: 1
title: A 2D vector you can add
overview: A physics engine is arithmetic on 2D vectors, so that is where everything begins. Today you build the Vec2 type and its first operation, addition, so every later lesson has positions and velocities to work with.
goal: Create a Vec2 value type with X and Y components and an addition that sums them componentwise.
spec:
  scenario: Adding two 2D vectors
  status: failing
  lines:
    - kw: Given
      text: 'the vectors {1, 2} and {3, 4}'
    - kw: When
      text: they are added
    - kw: Then
      text: 'the result is {4, 6}'
    - kw: And
      text: 'Add({-1, 5}, {2, -3}) is {1, 2}'
code:
  lang: go
  source: |
    // the value type every position, velocity, and force will be
    type Vec2 struct{ X, Y float64 }
    // componentwise sum, returns a new vector
    func Add(a, b Vec2) Vec2 {
      return Vec2{ /* X + X, Y + Y */ }
    }
checkpoint: You have a Vec2 type and can add two of them. Commit and stop here.
---

Every quantity in a physics engine - a position, a velocity, a force, a contact
normal - is a **2D vector**: a pair of numbers you can do arithmetic on. Before any
of the interesting motion or collision code can exist, that value type has to
exist, along with the operations that combine vectors. The most basic of those is
**addition**, which sums the two components independently: moving a point by an
offset, or combining two velocities, is just adding vectors.

Use plain `float64` components so results stay exact for the clean inputs the specs
use. Keep `Add` a **pure function** that returns a brand-new `Vec2` rather than
mutating its inputs - the rest of the engine leans on vectors being simple,
copyable values, and that convention starts today.
