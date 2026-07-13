---
project: build-a-physics-engine
lesson: 12
title: Mass and forces
overview: Forces, not accelerations, are what the world really applies - and the same force moves a light body more than a heavy one. Today you give a body mass and turn an applied force into an acceleration with F = ma.
goal: Give a body mass, let a force be applied to it, and derive the acceleration as force divided by mass.
spec:
  scenario: Turning a force into an acceleration
  status: failing
  lines:
    - kw: Given
      text: 'a body of mass 2 with the force {0, -20} applied to it'
    - kw: When
      text: its acceleration is derived from the applied force
    - kw: Then
      text: 'the acceleration is {0, -10} (force divided by mass)'
    - kw: And
      text: 'a body of mass 4 with the same force {0, -20} has acceleration {0, -5} - the heavier body accelerates less'
code:
  lang: go
  source: |
    // add Mass float64 and Force Vec2 fields to Body
    func (b *Body) ApplyForce(f Vec2) { b.Force = Add(b.Force, f) }
    // Newton's second law rearranged: a = F / m
    func (b *Body) accelerationFromForce() Vec2 { return Scale(b.Force, 1/b.Mass) }
checkpoint: A body has mass, and an applied force becomes an acceleration by F = ma. Commit and stop here.
---

Newton's second law says force equals mass times acceleration, `F = ma`, so the
acceleration a force produces is `F / m`. That is why a feather and a bowling ball
fall at the same rate under gravity but respond very differently to a shove: gravity
scales its force with mass so the accelerations match, but an equal push on a heavier
body produces less acceleration. Give the body a **`Mass`** and a **`Force`** field,
apply forces to it, and convert the accumulated force to the acceleration your
integrator already consumes.

`ApplyForce` **adds** into the force field rather than overwriting it, because in a
moment you will want several forces (gravity, a push, a spring) to combine on one
body in a single step. Today only one force is applied, so the sum is just that
force - but writing it as an accumulation now sets up the next lesson, where summing
and clearing forces each step is the whole point.
