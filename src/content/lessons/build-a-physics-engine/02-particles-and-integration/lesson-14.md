---
project: build-a-physics-engine
lesson: 14
title: A fixed timestep
overview: A simulation advances in fixed slices of time so its results are exactly reproducible. Today you run the step loop several times under gravity and pin the exact trajectory, closing out the integration chapter.
goal: Advance a body through several fixed timesteps under gravity and land on an exact position.
spec:
  scenario: Falling under gravity for four steps
  status: failing
  lines:
    - kw: Given
      text: 'a mass-1 body at rest at {0, 0}, gravity force {0, -10} applied each step, dt = 0.5'
    - kw: When
      text: 'the body is stepped four times (apply gravity, derive acceleration, integrate, clear forces)'
    - kw: Then
      text: 'its velocity is {0, -20} and its position is {0, -25}'
    - kw: And
      text: 'after just one step it is at velocity {0, -5}, position {0, -2.5}'
code:
  lang: go
  source: |
    func step(b *Body, gravity Vec2, dt float64) {
      b.ApplyForce(gravity)
      b.Acceleration = b.accelerationFromForce()
      b.Integrate(dt)
      b.ClearForces()
    }
    // call step four times with gravity {0,-10}, dt 0.5
checkpoint: A body falls under gravity over a fixed number of steps to an exact position. Commit and stop here.
---

A **fixed timestep** means every frame advances the simulation by the same `dt`,
regardless of how much real time passed. That is what makes the whole engine
**deterministic**: the same starting state and the same number of steps always yield
the same result, down to the last decimal, which is exactly what lets these lessons
pin an exact position after four steps. Real engines accumulate real elapsed time and
run whole fixed steps to keep this property while staying in sync with a clock.

Trace the fall: with `dt = 0.5` and gravity accelerating at `{0, -10}`, each step adds
`-5` to the velocity and then moves by the new velocity. After four steps the velocity
has reached `{0, -20}` and the body has fallen to `{0, -25}`. This is your first real
simulation - a body dropping under gravity - and printing its position each step gives
a small falling-object demo. Everything from here adds shapes and collisions on top of
this loop.
