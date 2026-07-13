---
project: build-a-physics-engine
lesson: 42
title: The full step pipeline
overview: Now the whole frame comes together - integrate, find contacts, resolve them, correct positions. Today you wire the complete step and watch a falling body stop on contact.
goal: Assemble a full world step that integrates, detects collisions via broadphase and narrowphase, then resolves and corrects them.
spec:
  scenario: A body caught by a contact in one step
  status: failing
  lines:
    - kw: Given
      text: 'gravity {0, 0}, a static circle A (radius 0.5) at {0, 0}, and a dynamic circle B (radius 0.5, restitution 0) at {0, 1.8} moving at {0, -1}'
    - kw: When
      text: the world is stepped with dt = 1
    - kw: Then
      text: 'B ends at velocity {0, 0} and position {0, 0.86} (it integrated to {0, 0.8}, then the contact stopped it and correction pushed it out)'
    - kw: And
      text: 'the static body A stays at {0, 0}'
code:
  lang: go
  source: |
    func (w *World) Step(dt float64) {
      // 1. integrate every dynamic body (as before)
      // 2. pairs := Broadphase(w.Bodies)
      // 3. for each pair: m := Collide(a, b); if m.Collision { Resolve; CorrectPositions }
    }
checkpoint: A full world step integrates, detects, and resolves in order. Commit and stop here.
---

This is the frame every physics engine runs. First **integrate** every dynamic body,
moving it under its forces - B falls from `{0, 1.8}` to `{0, 0.8}`. Then run the
**broadphase** to get candidate pairs, and the **narrowphase** `Collide` on each to get
manifolds. For every real contact, **resolve** the velocities so the bodies stop
approaching, then **correct** the positions to ease out the overlap. In one step B goes
from falling to resting: the impulse zeroes its velocity, and correction nudges it from
`0.8` to `0.86`, out of the `0.2` overlap.

From here on every body in the world carries a **shape**, since the broadphase asks
each one for its world bounds - a world of bare point masses has nothing to collide.
Order is everything here. Integrating first means contacts are detected at the bodies'
new positions, which is why detection has to run after the move, not before. Resolving
velocity before correcting position keeps the two solvers from fighting. With this
pipeline the world is a real, if basic, simulator - bodies fall, hit things, and stop.
The last two lessons make it stable enough for stacks and then run a full settling
scene.
