---
project: build-a-physics-engine
lesson: 9
title: Integrating position by velocity
overview: Motion is just position changing by velocity over time. Today you take the first integration step - advance a body by its velocity for a small timestep - the beating heart of the simulation loop.
goal: Advance a body's position by its velocity scaled by a timestep.
spec:
  scenario: Moving a body one timestep
  status: failing
  lines:
    - kw: Given
      text: 'a body at position {1, 1} with velocity {2, -4}'
    - kw: When
      text: it is integrated with dt = 0.5
    - kw: Then
      text: 'its position is {2, -1} and its velocity is still {2, -4}'
code:
  lang: go
  source: |
    // position moves by velocity * dt; velocity is unchanged (no forces yet)
    func (b *Body) Integrate(dt float64) {
      b.Position = Add(b.Position, Scale(b.Velocity, dt))
    }
checkpoint: A body moves by its velocity each timestep. Commit and stop here.
---

**Integration** is how a simulation turns velocity into a change in position over a
slice of time. For a small **timestep** `dt`, a body moving at a constant velocity
travels `velocity * dt`, so its new position is the old one plus that displacement.
With velocity `{2, -4}` and `dt = 0.5`, the body moves `{1, -2}` and lands at
`{2, -1}`. There are no forces yet, so velocity does not change - only position
moves.

This one line is the core of every simulation step you will ever write; everything
else - gravity, forces, collisions - is about computing the right velocity *before*
this move happens. Advancing by a fixed `dt` each frame (rather than by real
elapsed time) is what will keep the simulation deterministic and reproducible, a
property you will lean on when pinning exact positions after many steps.
