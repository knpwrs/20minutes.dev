---
project: build-a-physics-engine
lesson: 10
title: Explicit Euler with acceleration
overview: Gravity is an acceleration - it changes velocity, which changes position. Today you write the naive integrator, explicit Euler, which moves the body first and then updates its velocity, so you can see next lesson why that order is a problem.
goal: Add an acceleration to the body and integrate it with explicit Euler, moving position before updating velocity.
spec:
  scenario: One explicit Euler step under acceleration
  status: failing
  lines:
    - kw: Given
      text: 'a body at {0, 0} with velocity {0, 0} and acceleration {0, -10}'
    - kw: When
      text: IntegrateExplicit is called with dt = 1
    - kw: Then
      text: 'its position is {0, 0} (moved by the OLD velocity) and its velocity is {0, -10}'
    - kw: And
      text: 'a body at {0, 0} with velocity {0, -5} and acceleration {0, -10} becomes position {0, -5}, velocity {0, -15} after one step'
code:
  lang: go
  source: |
    // add an Acceleration Vec2 field to Body first
    func (b *Body) IntegrateExplicit(dt float64) {
      // explicit: move by the CURRENT velocity, THEN change velocity
      b.Position = Add(b.Position, Scale(b.Velocity, dt))
      b.Velocity = Add(b.Velocity, Scale(b.Acceleration, dt))
    }
checkpoint: A body accelerates using explicit Euler, updating position from the old velocity. Commit and stop here.
---

Add an **`Acceleration`** field to `Body`. Acceleration is how forces enter the
simulation - for now, gravity is a constant `{0, -10}` pulling downward. To
integrate, you now update two quantities each step: velocity changes by
`acceleration * dt`, and position changes by `velocity * dt`. The question is the
**order**, and **explicit (forward) Euler** picks the simple one: move the position
using the velocity you currently have, then update the velocity.

That ordering is the catch. Starting from rest, the position does not move at all on
the first step (the old velocity was zero), even though the body is clearly
accelerating - the motion always lags a step behind the velocity. It is the obvious
way to write an integrator and it is what a naive implementation does, which is
exactly why the next lesson contrasts it with a one-line change that behaves far
better. Keep this method named `IntegrateExplicit`; you will keep it around as the
counterexample.
