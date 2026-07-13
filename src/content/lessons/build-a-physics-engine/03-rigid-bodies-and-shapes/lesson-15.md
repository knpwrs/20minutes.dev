---
project: build-a-physics-engine
lesson: 15
title: Inverse mass
overview: Collision math divides by mass constantly, and a wall has effectively infinite mass, so engines store one over the mass instead. Today you compute inverse mass, where a mass of zero means immovable.
goal: Store a body's inverse mass, defined so that a mass of zero yields an inverse mass of zero.
spec:
  scenario: Deriving inverse mass from mass
  status: failing
  lines:
    - kw: Given
      text: a body
    - kw: When
      text: SetMass is called with 2
    - kw: Then
      text: 'Mass is 2 and InvMass is 0.5'
    - kw: And
      text: 'SetMass(4) gives InvMass 0.25, and SetMass(0) gives InvMass 0 - a mass of zero means infinite mass, an immovable body'
code:
  lang: go
  source: |
    // add InvMass float64 and Restitution float64 fields to Body
    func (b *Body) SetMass(m float64) {
      b.Mass = m
      if m == 0 {
        b.InvMass = 0 // infinite mass: a static, immovable body
      } else {
        b.InvMass = 1 / m
      }
    }
checkpoint: A body stores its inverse mass, with zero standing for an immovable body. Commit and stop here.
---

Collision response is full of divisions by mass, and doing them as multiplications by
a stored **inverse mass** is both faster and, more importantly, lets you represent an
**immovable** body cleanly. A wall or the ground should never budge no matter what
hits it - that is a body of *infinite* mass, and `1 / infinity` is `0`. So the
convention is: a mass of `0` is a special marker meaning infinite mass, and its
inverse mass is `0`. Multiplying any impulse by that zero inverse mass produces no
change in velocity, which is exactly what "immovable" means.

Set both together through `SetMass` so they never drift out of sync. While you are
here, add a **`Restitution`** field - a number from `0` to `1` for how bouncy the
body is, `0` for a dead thud and `1` for a perfect bounce. It just rides along as
data today; the resolution chapter is where it earns its keep. The next lesson uses
this zero inverse mass to make a static body ignore forces entirely.
