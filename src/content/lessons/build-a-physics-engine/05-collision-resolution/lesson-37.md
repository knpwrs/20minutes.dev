---
project: build-a-physics-engine
lesson: 37
title: Angular integration
overview: A spinning body has an angle and an angular velocity, updated by torque exactly the way position is updated by force. Today you integrate rotation alongside translation.
goal: Integrate a body's angular velocity from torque and its angle from angular velocity, using semi-implicit Euler.
spec:
  scenario: Spinning up under a torque
  status: failing
  lines:
    - kw: Given
      text: 'a body with angular velocity 0, angle 0, torque 4, and inverse inertia 1.5'
    - kw: When
      text: it is integrated with dt = 0.5
    - kw: Then
      text: 'its angular velocity is 3 and its angle is 1.5'
    - kw: And
      text: 'a body with inverse inertia 0 (a static body) does not spin no matter the torque'
code:
  lang: go
  source: |
    // add AngularVelocity float64 and Torque float64 to Body; extend Integrate:
    // (linear part stays; append the rotational part, same semi-implicit order)
    b.AngularVelocity += b.InvInertia * b.Torque * dt
    b.Angle += b.AngularVelocity * dt
checkpoint: Bodies spin under torque, integrating rotation the same way as translation. Commit and stop here.
---

Rotation is a perfect mirror of translation. Where a **force** produces a linear
acceleration `F / m` that changes velocity, a **torque** produces an angular
acceleration `torque * invInertia` that changes **angular velocity**; and where velocity
moves the position, angular velocity turns the **angle**. Use the same **semi-implicit**
order you settled on for linear motion - update the angular velocity first, then the
angle from the new value - so the two integrations stay consistent and stable.

Extend the body's `Integrate` to do both halves in one call. Because angular velocity,
torque, and inverse inertia all default to zero, every earlier linear-only test is
unaffected - a body with no rotational state integrates exactly as before. A static
body's inverse inertia is `0`, so its angular velocity never changes and it stays fixed
in rotation, matching how it ignores forces. With a torque of `4` and inverse inertia
`1.5` over half a step, the body spins up to angular velocity `3`. Now off-center
contacts can make bodies turn.
