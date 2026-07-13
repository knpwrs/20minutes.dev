---
project: build-a-physics-engine
lesson: 11
title: Semi-implicit Euler
overview: Swapping two lines - update velocity before position - gives semi-implicit (symplectic) Euler, the integrator nearly every game engine uses because it stays stable. Today you write it and watch it diverge from the explicit version.
goal: Integrate with semi-implicit Euler, updating velocity first, and show it diverges from explicit Euler after one step.
spec:
  scenario: One semi-implicit Euler step under acceleration
  status: failing
  lines:
    - kw: Given
      text: 'a body at {0, 0} with velocity {0, 0} and acceleration {0, -10}'
    - kw: When
      text: Integrate is called with dt = 1
    - kw: Then
      text: 'its velocity is {0, -10} and its position is {0, -10} (moved by the NEW velocity)'
    - kw: And
      text: 'an identical body integrated with IntegrateExplicit instead ends at position {0, 0}, so the two integrators disagree after one step'
code:
  lang: go
  source: |
    // semi-implicit: change velocity FIRST, then move by the NEW velocity
    func (b *Body) Integrate(dt float64) {
      b.Velocity = Add(b.Velocity, Scale(b.Acceleration, dt))
      b.Position = Add(b.Position, Scale(b.Velocity, dt))
    }
checkpoint: Your canonical integrator, Integrate, is semi-implicit Euler and behaves stably. Commit and stop here.
---

**Semi-implicit (symplectic) Euler** flips the two lines: update the velocity first,
then move the position using that *new* velocity. It is a one-word change - which
line runs first - but the result is dramatically better. From rest under gravity,
the body actually starts falling on the very first step (`{0, -10}` instead of
staying put), and over many steps semi-implicit Euler does not pump energy into the
system the way explicit Euler does, so orbits and bounces stay stable instead of
spiralling out. This is why it is the default integrator in essentially every 2D
game engine.

Make this the body's canonical **`Integrate`** - every later lesson (forces,
gravity, the world step) builds on it, while `IntegrateExplicit` stays only as the
contrast. Note that your earlier position-only integration test still holds: a body
with zero acceleration integrates the same either way, because the velocity update
adds nothing. The divergence only appears once there is an acceleration to apply.
