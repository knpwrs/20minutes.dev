---
project: build-a-physics-engine
lesson: 38
title: Contact-point impulses and spin
overview: A hit off to one side of a body's center does not just slow it - it spins it. Today you upgrade the impulse resolver with the r cross n terms that couple contacts to rotation.
goal: Resolve a contact at a specific point, producing both a linear and an angular velocity change.
spec:
  scenario: An off-center hit produces spin
  status: failing
  lines:
    - kw: Given
      text: 'a static ground and a box B (inverse mass 1, inverse inertia 1.5, restitution 0) at {0, 0} moving at {0, -2}, contact normal {0, 1} at contact point {1, -1}'
    - kw: When
      text: the contact is resolved at that point
    - kw: Then
      text: 'B ends at velocity {0, -1.2} and angular velocity 1.2 (the off-center contact spins it)'
    - kw: And
      text: 'a contact exactly at the center (offset {0, 0}) produces zero angular velocity and, with the rotational terms gone from the denominator too, the plain linear impulse that fully stops it at velocity {0, 0}'
code:
  lang: go
  source: |
    func CrossSV(s float64, v Vec2) Vec2 { return Vec2{-s * v.Y, s * v.X} } // omega x r
    // rA, rB = contact - center; point velocity = Velocity + CrossSV(AngularVelocity, r)
    // vn from point velocities; rnA, rnB = Cross(rA, n), Cross(rB, n)
    // denom = imA + imB + rnA*rnA*invIA + rnB*rnB*invIB
    // apply P = j*n: Velocity += imB*P; AngularVelocity += invIB*Cross(rB, P)
checkpoint: The resolver handles contacts at a point, turning off-center hits into spin. Commit and stop here.
---

Until now every impulse acted as if it hit the body's dead center. A real contact
happens at a **point**, and a point off to the side does two things at once: it changes
the linear velocity *and* it applies a torque that changes the **angular velocity**. The
upgraded resolver accounts for this. The velocity used in the closing-speed test is the
**point velocity**, `Velocity + omega x r`, where `r` is the contact point relative to
the center and `omega x r` is the `CrossSV` helper. And the impulse denominator gains a
rotational term per body, `(r cross n)^2 * invInertia`, which makes a body that is easy
to spin absorb more of the impulse as rotation.

Applying the impulse `P = j * n` now updates two quantities per body: velocity by
`imB * P` as before, and angular velocity by `invInertia * (r cross B)`. A box caught on
its corner by the rising ground picks up spin as well as an upward push - here angular
velocity `1.2`. A contact exactly at the center has `r cross n = 0`, so the rotational
term vanishes and you recover the plain linear impulse, which is why every earlier
center-contact test still holds. This is the real collision response that Chris Hecker's
rigid-body series derives.
