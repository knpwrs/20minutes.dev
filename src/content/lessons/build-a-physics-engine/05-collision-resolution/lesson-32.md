---
project: build-a-physics-engine
lesson: 32
title: The impulse magnitude
overview: The size of the kick that resolves a contact comes from one formula involving restitution and inverse mass. Today you compute the impulse scalar, the core of collision response.
goal: Compute the impulse magnitude for a contact from the relative normal velocity, restitution, and inverse masses.
spec:
  scenario: The impulse scalar for a head-on contact
  status: failing
  lines:
    - kw: Given
      text: 'two bodies of inverse mass 1 approaching at relative normal velocity -2'
    - kw: When
      text: the impulse magnitude is computed with restitution 1
    - kw: Then
      text: it is 2
    - kw: And
      text: 'with restitution 0 it is 1, and when the relative normal velocity is positive (separating) it is 0'
code:
  lang: go
  source: |
    // j = -(1 + e) * vn / (invMassA + invMassB), and never negative
    func ImpulseMagnitude(vn, e, imA, imB float64) float64 {
      if vn > 0 { return 0 } // already separating: no impulse
      return -(1 + e) * vn / (imA + imB)
    }
checkpoint: You can compute the impulse magnitude for a contact. Commit and stop here.
---

The **impulse magnitude** `j` is the strength of the instantaneous change in momentum
that resolves a contact. Its formula, `j = -(1 + e) * vn / (imA + imB)`, packs three
ideas: the closing speed `vn` sets the scale, the **restitution** `e` decides how much
of it bounces back (`0` for a dead stop, `1` for a perfect rebound, so `1 + e` ranges
from `1` to `2`), and dividing by the total inverse mass shares the kick between the two
bodies by how movable each is. A lighter body takes more of the velocity change.

The negative sign turns the negative closing velocity into a positive push apart. Guard
the separating case: if `vn` is already positive the bodies are parting on their own, so
`j` is `0` - no impulse, matching the resting-contact rule from last lesson. For two
equal-mass bodies closing at `-2`, a perfect bounce gives `j = 2` and a dead one gives
`j = 1`. Next lesson turns this magnitude into an actual velocity change.
