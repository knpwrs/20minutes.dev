---
project: build-a-load-balancer
lesson: 16
title: Least-connections over live load
overview: Now the connection tracking and the least-connections algorithm meet. By holding several leases open at once, you can watch least-connections spread work across the idle backends - the payoff for wiring active counts into Begin.
goal: Show that with leases held open, least-connections routes each new request to a backend that is not yet busy.
spec:
  scenario: Least-connections spreads live in-flight load
  status: failing
  lines:
    - kw: Given
      text: 'a Balancer over least-connections for A, B, C all up and idle, where each Begin is left open (not released)'
    - kw: When
      text: 'Begin is called four times in a row'
    - kw: Then
      text: 'it returns A, B, C, A - each of the first three goes to a still-idle backend, and the fourth ties at 1 active and picks A first'
    - kw: And
      text: 'after the four leases, Active() is A=2, B=1, C=1'
code:
  lang: go
  source: |
    // No new production code: Begin already increments Active(), and the
    // least-connections Select() already reads Active(). This lesson holds the
    // leases open (skips release) so the in-flight counts drive the next pick.
    b1, _, _ := bal.Begin() // A: all were 0
    b2, _, _ := bal.Begin() // B: A=1, rest 0
    b3, _, _ := bal.Begin() // C: A=1, B=1, C=0
    b4, _, _ := bal.Begin() // A: all 1, tie -> first
checkpoint: Least-connections demonstrably reacts to live in-flight load. Commit and stop here.
---

This is the moment the load-aware design proves itself. `Begin` raises a backend's
active count, and least-connections reads that same count, so when you hold leases
open - simulating requests still in flight - each new `Begin` is pushed toward a
backend that is not yet busy. Three idle backends fill up one each, and only when
they are all equally loaded does the deterministic tie-break send the fourth back to
`A`.

Expect **no new production code** today: the mechanism was fully built across the
active-count and lease lessons, and this test simply exercises them together. A green
result with an empty diff is the right outcome and the satisfying "it works" beat for
the chapter. Releasing one of the open leases would immediately make that backend the
least-loaded again - a good thing to try by hand to feel the feedback loop, even
though the pinned spec keeps the leases open for a clean, exact count.
