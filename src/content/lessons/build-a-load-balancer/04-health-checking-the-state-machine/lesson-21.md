---
project: build-a-load-balancer
lesson: 21
title: Flapping in a live stream
overview: Health and selection now meet in motion. As a backend goes down and comes back during a run of requests, round-robin must adapt each pick to the current healthy set. Today you pin that exact interleaving.
goal: Show a selection stream tracking a backend leaving and rejoining the rotation mid-run.
spec:
  scenario: Selection follows health changes during a request stream
  status: failing
  lines:
    - kw: Given
      text: 'a round-robin selector over A, B, C all up'
    - kw: When
      text: 'three selections are made, then B is marked down and two more are made, then B is marked up and three more are made'
    - kw: Then
      text: 'the full sequence is A, B, C, C, A, C, A, B'
    - kw: And
      text: 'while B is down the cycle runs over [A, C] of length 2, and when B returns the cycle runs over [A, B, C] of length 3 again - the counter never resets'
code:
  lang: go
  source: |
    // No new code: round-robin already reads Available() fresh each call and
    // takes n % len(avail). Trace the ever-increasing counter n:
    //   up A,B,C: n=0,1,2 over len 3 -> A,B,C
    //   B down:   n=3,4   over len 2 -> avail[1]=C, avail[0]=A -> C,A
    //   B up:     n=5,6,7 over len 3 -> avail[2]=C, avail[0]=A, avail[1]=B -> C,A,B
checkpoint: Selection adapts to a backend flapping down and back up mid-stream. Commit and stop here.
---

This lesson pins the **interaction** the whole selection design was built to make
free: because round-robin evaluates `Available()` and `n % len(avail)` afresh on
every call, a health change between two selections is reflected immediately in the
next pick, with no code aware of the transition. When `B` drops out, the cycle
silently shrinks to `[A, C]`; when it returns, the cycle grows back to `[A, B, C]`.

The subtle, must-pin detail is that the counter `n` **keeps climbing** across the
membership changes - it is not reset when a backend leaves or joins. That is what
produces the exact `A, B, C, C, A, C, A, B` sequence rather than a naive
"restart from A" each time the set changes. Tracing the counter by hand is the only
way to be sure the expected values are right, which is exactly why the spec pins the
whole eight-pick stream. This is a payoff lesson: the behavior emerges from parts you
already built, and the test is the proof.
