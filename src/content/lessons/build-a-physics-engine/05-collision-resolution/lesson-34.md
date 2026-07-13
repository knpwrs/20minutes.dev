---
project: build-a-physics-engine
lesson: 34
title: Bouncing off an immovable wall
overview: The inverse-mass zero you built for statics now pays off - a wall absorbs no velocity, so a ball bounces off it cleanly. Today you resolve a dynamic body against a static one.
goal: Resolve a collision between a dynamic body and a static one, leaving the static body unchanged.
spec:
  scenario: A ball rebounding from a wall
  status: failing
  lines:
    - kw: Given
      text: 'a static wall A (inverse mass 0) and a ball B (inverse mass 1) moving at {-3, 0} toward it, contact normal {1, 0}, restitution 1'
    - kw: When
      text: the collision is resolved
    - kw: Then
      text: 'the ball ends at velocity {3, 0} (perfectly reversed) and the wall stays at {0, 0}'
    - kw: And
      text: 'with restitution 0 the ball ends at velocity {0, 0} (it stops dead against the wall)'
code:
  lang: go
  source: |
    // no new code: the same Resolve, now with one inverse mass at 0.
    // total inverse mass is 0 + 1 = 1, so j = -(1+e)*vn.
    // the wall's velocity change is impulse * 0 = 0; only the ball moves.
checkpoint: A ball bounces off a static wall while the wall never moves. Commit and stop here.
---

This lesson writes no new resolution code - it is the payoff for representing a static
body as **inverse mass zero**. When the ball hits the wall, the total inverse mass in the
denominator is just the ball's, and the impulse applied to the wall is multiplied by its
zero inverse mass, so the wall does not move a hair. All of the velocity change lands on
the ball. A perfect-restitution hit flips its `{-3, 0}` clean into `{3, 0}`; a
zero-restitution hit stops it dead at `{0, 0}`.

That is exactly the behavior you want from the ground and walls, and it falls out for
free from the inverse-mass convention rather than needing a special case in the solver. It
is worth confirming as its own lesson because the static-versus-dynamic contact is the
single most common collision in a real scene - almost everything eventually rests on the
floor. The same `Resolve` handles two dynamic bodies, a dynamic and a static, and (were
both static) simply does nothing.
