---
project: build-a-physics-engine
lesson: 35
title: Positional correction
overview: Impulses fix velocities but leave bodies slightly sunk into each other, and that error accumulates. Today you push overlapping bodies apart directly, with a slop margin so resting stacks stay calm.
goal: Move two overlapping bodies apart along the normal by a fraction of the penetration, ignoring a small slop.
spec:
  scenario: Nudging sunk bodies apart
  status: failing
  lines:
    - kw: Given
      text: 'body A at {0, 0} and body B at {1.5, 0}, both inverse mass 1, a manifold with normal {1, 0} and penetration 0.5 (slop 0.05, correction 40 percent)'
    - kw: When
      text: positional correction is applied
    - kw: Then
      text: 'A moves to {-0.09, 0} and B moves to {1.59, 0}'
    - kw: And
      text: 'if the penetration is only 0.03 (below the slop) neither body moves'
code:
  lang: go
  source: |
    const slop, percent = 0.05, 0.4
    func CorrectPositions(a, b *Body, m Manifold) {
      // scalar = max(penetration - slop, 0) * percent / (imA + imB)
      corr := math.Max(m.Penetration-slop, 0) * percent / (a.InvMass + b.InvMass)
      push := Scale(m.Normal, corr)
      a.Position = Sub(a.Position, Scale(push, a.InvMass))
      b.Position = Add(b.Position, Scale(push, b.InvMass))
    }
checkpoint: Overlapping bodies are nudged apart along the normal, with a slop margin. Commit and stop here.
---

The velocity solver stops bodies approaching, but it never removes the overlap that has
already happened, so bodies gradually **sink** into each other and into the floor. The
fix is **positional correction**: move the two bodies apart along the contact normal by a
fraction of the penetration, split by inverse mass just like an impulse (a static body,
inverse mass zero, stays put and the dynamic one takes the whole move).

Two constants keep it stable. The **slop** is a small penetration you deliberately
tolerate - correcting all the way to zero every frame makes resting stacks vibrate, so
overlaps below the slop are left alone (which is why penetration `0.03` produces no
motion here). The **percent** corrects only a fraction each frame, easing the error out
over several steps instead of snapping and overshooting. With penetration `0.5`, slop
`0.05`, and `40` percent split two ways, each body moves `0.09`. This runs after the
velocity resolve, every contact, every frame.
