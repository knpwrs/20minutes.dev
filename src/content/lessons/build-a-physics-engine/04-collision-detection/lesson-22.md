---
project: build-a-physics-engine
lesson: 22
title: Circle versus circle
overview: Collision detection has to answer two things at once - are these touching, and if so which way and how deep? Today you build the contact manifold and the simplest test, circle versus circle.
goal: Detect overlap between two circles and return a contact manifold with the normal and penetration depth.
spec:
  scenario: Two circles overlapping
  status: failing
  lines:
    - kw: Given
      text: 'a circle of radius 1 at {0, 0} and a circle of radius 1 at {1.5, 0}'
    - kw: When
      text: they are tested for collision
    - kw: Then
      text: 'they collide with normal {1, 0} and penetration 0.5'
    - kw: And
      text: 'radius-1 circles at {0, 0} and {3, 0} do not collide, and two coincident circles report normal {1, 0} with penetration 2'
code:
  lang: go
  source: |
    type Manifold struct {
      Collision   bool
      Normal      Vec2    // unit vector from A toward B
      Penetration float64 // overlap depth
    }
    func CircleVsCircle(ca Vec2, ra float64, cb Vec2, rb float64) Manifold {
      d := Sub(cb, ca)
      dist := Length(d)
      if dist >= ra+rb { return Manifold{} } // no overlap
      // normal from A to B (guard dist==0), penetration = (ra+rb) - dist
    }
checkpoint: Two circles report whether, how deep, and in which direction they collide. Commit and stop here.
---

Every collision test in the engine returns the same little package of facts, the
**contact manifold**: did the shapes overlap, and if so, the **normal** (the unit
direction to separate them, pointing from A toward B) and the **penetration** (how far
they overlap along that normal). Resolution consumes exactly these two numbers, so
getting the manifold right is the whole game.

Circle versus circle is the cleanest case. Measure the distance between centers; if it
is less than the sum of the radii they overlap, the penetration is that shortfall, and
the normal is the direction from one center to the other. Pin the edges: circles just
touching or fully apart do **not** collide, and two circles at the *exact same point*
have no real direction - guard that zero distance and return a fixed fallback normal
`{1, 0}` so the manifold is never poisoned by a divide by zero. That coincident case is
rare but real, and handling it now keeps the resolver safe.
