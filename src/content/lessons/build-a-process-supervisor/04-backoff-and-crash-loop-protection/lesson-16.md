---
project: build-a-process-supervisor
lesson: 16
title: The injected clock
overview: Backoff and shutdown timeouts are about time, and time in a test must be controllable or nothing is deterministic. So the supervisor never reads the real clock - it reads an injected one you can advance by hand. Today you add that clock and have the supervisor stamp each restart with the current time.
goal: Inject a clock the supervisor reads, and record the time of each restart.
spec:
  scenario: The supervisor reads time from an injectable clock
  status: failing
  lines:
    - kw: Given
      text: 'a FakeClock starting at t=0 that Advance(d) moves forward, wired into the supervisor'
    - kw: When
      text: 'the clock is advanced to t=5s and an on-failure "worker" is reaped with code 1 (triggering a restart)'
    - kw: Then
      text: 'the service records LastRestart == 5s (the supervisor read the time from the injected clock, not the wall clock)'
    - kw: And
      text: 'after Advance(3s) more, the clock''s Now() reports 8s'
code:
  lang: go
  source: |
    type Clock interface { Now() time.Duration }
    type FakeClock struct{ t time.Duration }
    func (c *FakeClock) Now() time.Duration      { return c.t }
    func (c *FakeClock) Advance(d time.Duration)  { c.t += d }
    // in the restart path: svc.LastRestart = s.clock.Now()
checkpoint: The supervisor reads time from an injectable clock and stamps each restart. Commit and stop here.
---

Everything from here on turns on **time**: how long to wait before a restart, how
many restarts happened in the last minute, how long to give a process to shut down.
If the supervisor read the operating system's wall clock, none of that would be
testable - you would be inserting real `sleep`s and hoping. The discipline that
saves you is the same one you applied to processes: inject the dependency. The
supervisor reads a `Clock`, and in tests that clock is a `FakeClock` you advance by
hand, so "two seconds passed" is a function call, not a wait.

Modelling time as a plain `Now()` you can move forward makes every interval in this
chapter an exact, reproducible value. Today the clock does just one visible job:
when a service restarts, the supervisor stamps it with `Now()`. That timestamp is
the raw material for both features ahead - measuring the gap before the next restart,
and counting how many restarts fell inside a recent window.
