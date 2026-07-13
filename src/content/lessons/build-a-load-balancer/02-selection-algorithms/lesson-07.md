---
project: build-a-load-balancer
lesson: 7
title: Skipping a down backend
overview: The reason selection reads Available rather than the whole pool is so a down backend simply drops out of the rotation. Today you pin that behavior for round-robin.
goal: Confirm round-robin never returns a down backend and cycles only through the healthy ones.
spec:
  scenario: A down backend is skipped by round-robin
  status: failing
  lines:
    - kw: Given
      text: 'a round-robin selector over a pool of A, B, C with B marked down'
    - kw: When
      text: 'Select is called four times'
    - kw: Then
      text: 'it returns A, C, A, C - B never appears'
    - kw: And
      text: 'the cycle length is 2 because only two backends are healthy'
code:
  lang: go
  source: |
    // No new code should be needed: because Select() reads Available(),
    // and Available() already filters out down backends, B is excluded.
    // The counter n is taken modulo len(avail), which is now 2, not 3.
checkpoint: Round-robin cycles only over healthy backends, skipping the down one. Commit and stop here.
---

This lesson is a **payoff** for the design choice you made two lessons ago: because
`Select` reads `Available()` and `Available` filters out down backends, marking `B`
down removes it from the rotation with no change to the round-robin code at all.
The cycle collapses from three backends to two, and the modulo now wraps over
length 2, so you get `A, C, A, C`.

A green test with no new production code is exactly the right outcome here - it
proves the seam between health and selection holds. The subtle part is that the
counter `n` keeps climbing regardless of how many backends are available, and the
`% len(avail)` is evaluated fresh each call. That is what lets the rotation adapt
the instant a backend's health changes, which you will pin as a live flap much
later in the project.
