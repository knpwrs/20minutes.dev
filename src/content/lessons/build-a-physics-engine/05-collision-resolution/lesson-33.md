---
project: build-a-physics-engine
lesson: 33
title: Applying the impulse
overview: An impulse changes both bodies' velocities in opposite directions, scaled by their inverse masses. Today you apply it and watch a head-on collision reverse.
goal: Apply an impulse along the normal to both bodies and produce their post-collision velocities.
spec:
  scenario: A head-on equal-mass bounce
  status: failing
  lines:
    - kw: Given
      text: 'bodies A (velocity {0, 0}) and B (velocity {-2, 0}), both inverse mass 1 and restitution 1, contact normal {1, 0}'
    - kw: When
      text: the collision is resolved
    - kw: Then
      text: 'A ends at velocity {-2, 0} and B ends at velocity {0, 0} (equal masses exchange velocity)'
    - kw: And
      text: 'with restitution 0 on both, A and B both end at velocity {-1, 0} (they move together)'
code:
  lang: go
  source: |
    func Resolve(a, b *Body, m Manifold) {
      vn := NormalVelocity(a, b, m.Normal)
      e := math.Min(a.Restitution, b.Restitution)
      j := ImpulseMagnitude(vn, e, a.InvMass, b.InvMass)
      impulse := Scale(m.Normal, j)
      a.Velocity = Sub(a.Velocity, Scale(impulse, a.InvMass))
      b.Velocity = Add(b.Velocity, Scale(impulse, b.InvMass))
    }
checkpoint: Resolving a contact updates both bodies' velocities, and a perfect bounce reverses them. Commit and stop here.
---

An impulse `j` along the normal `n` is a momentum change `j * n` applied **oppositely**
to the two bodies: A is pushed back along the normal, B forward along it, each scaled by
its own inverse mass so the heavier body moves less. That is the whole of
`Resolve` - compute the closing speed, get the magnitude with the pair's restitution
(take the smaller of the two, so anything touching a dead surface stops dead), and split
the kick.

The classic sanity check is two equal masses in a head-on hit: with restitution `1` they
**exchange** velocities, so a body slamming into a still one stops while the still one
flies off - exactly the click of billiard balls. With restitution `0` they end at the
same velocity and travel on together, a perfectly inelastic thud. Those two endpoints,
`0` and `1`, bracket every real material in between, and pinning both proves the impulse
math is right.
