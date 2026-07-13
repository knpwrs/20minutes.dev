---
project: build-a-physics-engine
lesson: 16
title: Static and dynamic bodies
overview: The ground has to hold still while everything falls onto it. Today you make a body with zero inverse mass ignore forces entirely, so statics and dynamics can share one world.
goal: Skip integration for a body whose inverse mass is zero, so no force can move it.
spec:
  scenario: A static body ignores forces
  status: failing
  lines:
    - kw: Given
      text: 'a static body (SetMass(0)) at {5, 5} with velocity {0, 0}'
    - kw: When
      text: 'a large force {0, -100} is applied and the body is stepped with dt = 1'
    - kw: Then
      text: 'its position is still {5, 5} and its velocity is still {0, 0}'
    - kw: And
      text: 'a dynamic body (SetMass(2)) at {5, 5} under the same force and step moves to velocity {0, -50}, position {5, -45}'
code:
  lang: go
  source: |
    func stepBody(b *Body, dt float64) {
      if b.InvMass == 0 { // static: never moves, just drop accumulated force
        b.ClearForces()
        return
      }
      b.Acceleration = b.accelerationFromForce()
      b.Integrate(dt)
      b.ClearForces()
    }
checkpoint: A static body stays put under any force while dynamic bodies still move. Commit and stop here.
---

A world holds two kinds of bodies: **dynamic** ones that respond to forces and
collisions, and **static** ones - the ground, walls, platforms - that never move.
The inverse mass you just built is the switch between them: a static body has
`InvMass == 0`, so the cleanest way to keep it still is to skip integration for it
entirely. Applying a force to it does nothing; even a huge force leaves it exactly
where it started.

Guard the step on `InvMass == 0` and return early, clearing any accumulated force so
it does not pile up. This is also why static bodies must be created with `SetMass(0)`
rather than a normal mass - it is what sets the zero inverse mass the guard checks.
For the dynamic body, the same force divided by mass `2` gives acceleration
`{0, -50}`, so after one second it is falling at `{0, -50}` and has dropped to
`{5, -45}`. One world, two behaviors, one field telling them apart.
