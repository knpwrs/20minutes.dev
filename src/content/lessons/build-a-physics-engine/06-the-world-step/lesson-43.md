---
project: build-a-physics-engine
lesson: 43
title: Iterating the solver
overview: One pass over the contacts is not enough when contacts push against each other, so the solver runs several passes per step. Today you resolve the whole contact list, iterated.
goal: Resolve every contact in the world a fixed number of iterations per step so coupled contacts converge.
spec:
  scenario: Resolving all contacts each step
  status: failing
  lines:
    - kw: Given
      text: 'gravity {0, 0}, and two independent stacks far apart - each a static circle at {0, 0} and {10, 0} with a dynamic circle (radius 0.5, restitution 0) falling at {0, -1} just above it'
    - kw: When
      text: the world is stepped with 8 solver iterations
    - kw: Then
      text: 'both falling circles end at velocity {0, 0} - the world resolved every contact in its list'
    - kw: And
      text: 'both static circles stay put, and running more iterations does not push a resolved contact past rest'
code:
  lang: go
  source: |
    // World gains a VelocityIterations field. In Step, after collecting contacts:
    // for iter := 0; iter < w.VelocityIterations; iter++ {
    //   for _, c := range contacts { Resolve(c.a, c.b, c.manifold) }
    // }
    // then correct positions once per contact
checkpoint: The world resolves its whole contact list, iterated for stability. Commit and stop here.
---

A single body against the floor resolves in one pass, but a **stack** does not: pushing
the bottom box out of the floor shoves it into the box above, whose contact you already
solved, so one sweep leaves the stack slightly wrong. The fix is to **iterate** - sweep
the whole contact list several times per step, each pass nudging every contact a little
closer to consistent. This is the **sequential impulse** solver at the heart of Box2D,
and a handful of iterations (here `8`) is enough for believable stacks.

Collect all the frame's contacts once, then loop the velocity resolve over that list
`VelocityIterations` times before doing a single positional correction per contact. Two
independent contacts, like the two far-apart stacks here, each resolve in the first
iteration and the rest are harmless - a contact already at rest gets an impulse of zero,
so extra passes never overshoot. Coupled contacts are where the extra passes earn their
keep, which the settling capstone shows directly. The number of iterations trades cost
for stability.
