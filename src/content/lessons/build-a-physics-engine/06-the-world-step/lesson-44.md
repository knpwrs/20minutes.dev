---
project: build-a-physics-engine
lesson: 44
title: 'Capstone: a ball settling on the ground'
overview: Everything you built runs at once - integration, collision, restitution, correction, iteration - as a ball drops onto the ground and comes to rest. This is the working engine.
goal: Run the full simulation until a dropped ball settles at rest on the ground, without passing through it.
spec:
  scenario: A dropped ball comes to rest
  status: failing
  lines:
    - kw: Given
      text: 'a world with gravity {0, -10}, a large static ground (a circle of radius 100 centered at {0, -100}, so its top is at y = 0), and a dynamic ball (radius 0.5, restitution 0) dropped from {0, 3}, with 8 solver iterations'
    - kw: When
      text: 'the world is stepped 600 times with dt = 1/60'
    - kw: Then
      text: 'the ball has settled: its center y is between 0.44 and 0.46 (resting just above the ground, sunk by about the collision slop) and its vertical speed is below 0.5'
    - kw: And
      text: 'at no step does the ball tunnel through the ground - its center y stays at or above 0.4 throughout'
code:
  lang: go
  source: |
    w := &World{Gravity: Vec2{0, -10}, VelocityIterations: 8}
    // add the static ground circle and the dynamic ball, then:
    for i := 0; i < 600; i++ {
      w.Step(1.0 / 60.0)
      // print ball.Position.Y every 30 steps to watch it fall and settle
    }
checkpoint: 'A ball drops, hits the ground, and settles at rest - your physics engine is complete. Commit and stop here.'
---

This is the promise the whole project was built to keep: a real **2D rigid-body
physics engine**. The ball is released three units up and everything you built runs on
every one of the six hundred frames. Semi-implicit Euler integrates it downward under
gravity; the broadphase and narrowphase find the moment it meets the ground; the impulse
solver, iterated for stability, kills its downward velocity; and positional correction
lifts it out of the small overlap so it rests just above the surface - its center settling
near `0.45`, sunk by about the collision slop - instead of sinking away or jittering.

Every layer is doing its job at once. From a `Vec2` that could only add, you have built
integration, rigid bodies, three shapes, full collision detection with exact contact
manifolds, and impulse resolution with restitution, friction, and rotation - the honest
core of the design that Box2D and every 2D game engine uses. It stops short of warm
starting, joints, and continuous collision, and that is the road ahead. Print the ball's
height each frame to watch it fall and settle: that trace is your engine, running.
