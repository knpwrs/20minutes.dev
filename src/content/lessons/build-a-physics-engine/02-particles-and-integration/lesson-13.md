---
project: build-a-physics-engine
lesson: 13
title: The force accumulator
overview: Several forces act on a body at once, and last frame's forces must not linger into this one. Today you sum multiple forces and clear the accumulator each step.
goal: Accumulate multiple applied forces into one net force and reset it to zero on demand.
spec:
  scenario: Summing and clearing forces
  status: failing
  lines:
    - kw: Given
      text: a body of mass 1
    - kw: When
      text: 'ApplyForce({3, 0}) and ApplyForce({0, 4}) are both called'
    - kw: Then
      text: 'the net Force is {3, 4}, and integrating one step from rest gives velocity {3, 4}, position {3, 4}'
    - kw: And
      text: 'after ClearForces the Force is {0, 0}, so a following step with no new force leaves the velocity unchanged'
code:
  lang: go
  source: |
    // ApplyForce already adds into b.Force; clearing zeroes it
    func (b *Body) ClearForces() { b.Force = Vec2{} }
    // a full step: derive acceleration, integrate, then clear the accumulator
    // b.Acceleration = b.accelerationFromForce(); b.Integrate(dt); b.ClearForces()
checkpoint: Forces sum into a net force each step and the accumulator clears cleanly. Commit and stop here.
---

Real motion comes from **several forces at once** - gravity pulling down, a contact
pushing up, maybe a spring or the wind. Because `ApplyForce` accumulates, calling it
repeatedly builds up the **net force** on the body: `{3, 0}` plus `{0, 4}` gives
`{3, 4}`, and dividing by mass gives the acceleration to integrate. This is the
**force accumulator** pattern, and it is how the world will let many independent
effects act on one body in a single frame.

The essential companion is **clearing** the accumulator after each step. Forces are
applied fresh every frame; if you never reset `Force`, last frame's gravity would
add to this frame's and the body would accelerate without bound. So a step is always
three beats: derive the acceleration from the accumulated force, integrate, then zero
the accumulator so the next frame starts clean. Pin that a cleared body with no new
force coasts at constant velocity.
