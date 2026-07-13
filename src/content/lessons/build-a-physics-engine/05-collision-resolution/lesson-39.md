---
project: build-a-physics-engine
lesson: 39
title: Coulomb friction
overview: Without friction, boxes slide forever and never tip or stack. Today you add a tangential friction impulse, clamped by the Coulomb limit, closing the resolution chapter.
goal: Compute a tangential friction impulse that opposes sliding, clamped so it never exceeds mu times the normal impulse.
spec:
  scenario: A clamped friction impulse
  status: failing
  lines:
    - kw: Given
      text: 'relative velocity {-3, -2}, contact normal {0, 1}, a normal impulse of 4, friction coefficient 0.5, total inverse mass 1'
    - kw: When
      text: the friction impulse is computed
    - kw: Then
      text: 'the raw tangent impulse -3 is clamped to -2, giving a friction impulse of {2, 0}'
    - kw: And
      text: 'applying it to a body of inverse mass 1 moving at {-3, -2} leaves it at {-1, -2}'
code:
  lang: go
  source: |
    func FrictionImpulse(rv, n Vec2, jNormal, mu, totalInvMass float64) Vec2 {
      t := Sub(rv, Scale(n, Dot(rv, n))) // tangent direction
      if LengthSquared(t) == 0 { return Vec2{} }
      t = Normalize(t)
      jt := -Dot(rv, t) / totalInvMass
      jt = math.Max(-mu*jNormal, math.Min(mu*jNormal, jt)) // Coulomb clamp
      return Scale(t, jt)
    }
checkpoint: Contacts apply clamped friction, so bodies slow and stop sliding. Commit and stop here.
---

**Friction** acts along the **tangent** - the part of the relative velocity
perpendicular to the normal - and opposes sliding. Its magnitude is computed just like
the normal impulse, but along the tangent direction, then **clamped** by **Coulomb's
law**: the friction impulse can be at most `mu` times the normal impulse. That clamp is
the whole character of dry friction - a resting box does not slide until you push harder
than friction can resist, and a sliding box is slowed by a force proportional to how
hard it presses down. Here the raw tangent impulse `-3` exceeds the limit `mu * j = 2`,
so it is capped at `-2`.

Apply the friction impulse the same way as the normal one, splitting it by inverse mass
(and, in the full resolver, by inverse inertia for the spin it induces). Combine the two
bodies' friction coefficients into one - a common choice is the square root of their
product. With friction in place the resolution chapter is complete: contacts now stop
approach, bounce with restitution, correct sinkage, induce spin, and resist sliding.
Print a box sliding to a halt on the ground to see it all at once.
