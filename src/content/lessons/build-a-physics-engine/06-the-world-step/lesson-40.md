---
project: build-a-physics-engine
lesson: 40
title: The world and its step
overview: A world is a bag of bodies with gravity, stepped forward together. Today you build the World and its first step, integrating every body under gravity.
goal: Build a World that holds bodies and gravity and integrates every dynamic body one step.
spec:
  scenario: Stepping a world under gravity
  status: failing
  lines:
    - kw: Given
      text: 'a world with gravity {0, -10} holding a dynamic body (mass 1) at {0, 0} and a static body at {5, 0}'
    - kw: When
      text: the world is stepped with dt = 1
    - kw: Then
      text: 'the dynamic body is at velocity {0, -10}, position {0, -10} and the static body is unchanged at {5, 0}'
    - kw: And
      text: gravity accelerates every dynamic body equally regardless of mass
code:
  lang: go
  source: |
    type World struct {
      Bodies  []*Body
      Gravity Vec2
    }
    func (w *World) Step(dt float64) {
      for _, b := range w.Bodies {
        if b.InvMass == 0 { continue } // statics never integrate
        b.ApplyForce(Scale(w.Gravity, b.Mass)) // weight = m * g, so accel = g
        b.Acceleration = b.accelerationFromForce()
        b.Integrate(dt)
        b.ClearForces()
      }
    }
checkpoint: A world steps all its dynamic bodies forward under gravity. Commit and stop here.
---

The **World** is the top-level object a user of the engine actually holds: a list of
**bodies** and a global **gravity**. Its `Step` advances the whole simulation by one
fixed `dt`, and today that means the integration loop from chapter two, now run over
every body. Applying gravity as a **weight** force `mass * gravity` means the mass
cancels when you divide by it to get acceleration, so every dynamic body falls at the
same rate `gravity` - which is why a feather and an anvil drop together in a vacuum.

Static bodies are skipped entirely, so the ground stays put while everything else
falls onto it. This is the walking skeleton of the engine: from here, each remaining
lesson slots one more stage into `Step` - finding contacts, then resolving them - until
a full frame runs. Right now stepping the world just drops its bodies, but that is
already a runnable simulation you can print frame by frame.
