---
project: build-a-load-balancer
lesson: 19
title: Active health probing
overview: Passive checks only learn from real traffic - so a down backend, getting no traffic, could never recover. Active probing fixes that by running an out-of-band health check against every backend, up or down.
goal: Run one probe round over all backends, recording each result as a success or failure streak.
spec:
  scenario: One probe round records an outcome for every backend
  status: failing
  lines:
    - kw: Given
      text: 'a pool of A (up), B (up), and C (down), and a probe function that reports A healthy, B unhealthy, C healthy'
    - kw: When
      text: 'the prober runs one round'
    - kw: Then
      text: 'A.SuccessStreak() is 1, B.FailStreak() is 1, and C.SuccessStreak() is 1'
    - kw: And
      text: 'C is probed even though it is down - that is how a down backend can later be brought back'
code:
  lang: go
  source: |
    // Pool gains All() returning every backend, up or down
    type Probe func(b *Backend) bool
    type Prober struct { pool *Pool }
    func (pr *Prober) RunOnce(probe Probe) {
      for _, b := range pr.pool.All() {   // ALL backends, not just Available()
        if probe(b) { b.RecordSuccess() } else { b.RecordFailure() }
      }
    }
checkpoint: An active probe round records a fresh outcome for every backend, including down ones. Commit and stop here.
---

**Active health checking** runs a dedicated probe against each backend - a health
endpoint request, a TCP connect - independent of user traffic. It exists to solve a
problem passive checking cannot: a backend marked `Down` receives no requests, so
without an out-of-band probe it would have no way to prove it has recovered and would
stay ejected forever. That is why the prober iterates `All()` backends, not just the
`Available()` ones.

Today the prober only **records** each probe's outcome into the same streak counters
your passive checks feed; it deliberately does not yet transition a down backend back
to up. Reusing `RecordSuccess` and `RecordFailure` means active and passive signals
accumulate in one place, so a backend recovering under probes and a backend serving
real traffic are treated identically. Keep the probe function injected, exactly like
the transport, so this stays a deterministic offline test rather than a real network
call. Turning a run of successful probes back into `Up` is the next lesson.
