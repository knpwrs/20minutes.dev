---
project: build-a-physics-engine
lesson: 31
title: Relative velocity along the normal
overview: Whether to respond to a contact depends entirely on how fast the two bodies are closing along the contact normal. Today you compute that single number, the input to every impulse.
goal: Compute the relative velocity of two bodies projected onto the contact normal.
spec:
  scenario: Closing speed along a normal
  status: failing
  lines:
    - kw: Given
      text: 'body A with velocity {0, 0} and body B with velocity {-2, 0}, contact normal {1, 0}'
    - kw: When
      text: the relative velocity along the normal is computed
    - kw: Then
      text: it is -2 (negative means the bodies are approaching)
    - kw: And
      text: 'if both bodies move at {1, 0} the relative normal velocity is 0 (a resting contact, not approaching)'
code:
  lang: go
  source: |
    // relative velocity of B with respect to A, projected onto the normal
    func NormalVelocity(a, b *Body, n Vec2) float64 {
      rv := Sub(b.Velocity, a.Velocity)
      return Dot(rv, n)
    }
checkpoint: You can measure how fast two bodies approach along a contact normal. Commit and stop here.
---

Collision response hinges on one scalar: the **relative velocity along the contact
normal**. Take the velocity of B relative to A (their difference) and project it onto
the normal with a dot product. The **sign** is what matters. Negative means the bodies
are moving *into* each other and the contact must push back; positive means they are
already separating and should be left alone; zero is a **resting contact**, two bodies
in steady sustained touch, neither approaching nor parting.

That resting-contact zero is the edge to respect. Two bodies drifting together at the
same velocity are touching but not colliding - firing an impulse at them would inject
energy from nothing and make a stack of boxes jitter. So every impulse you compute next
lesson is gated on this number being negative. Getting the closing speed right, sign and
all, is the foundation of a stable solver.
