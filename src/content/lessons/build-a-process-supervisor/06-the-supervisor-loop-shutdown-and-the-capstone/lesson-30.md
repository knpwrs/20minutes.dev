---
project: build-a-process-supervisor
lesson: 30
title: 'Capstone: supervising a scripted system'
overview: The finale runs a whole scripted system through the supervisor - a service that crash-loops until it is given up on, and one that waits on a dependency - and asserts the exact state timeline and final states. Every layer you built proves itself at once.
goal: Run a scripted multi-service timeline and assert every state transition and the final states exactly.
spec:
  scenario: A full system reaches its exact final state
  status: failing
  lines:
    - kw: Given
      text: 'db (never, no deps), web (always, requires db), and flaky (on-failure, no deps); backoff 1,2,4,8 capped at 8s; crash-loop max 3 in 60s; grace 5s'
    - kw: When
      text: 'StartAll runs at t=0: db and flaky start, but web is held Stopped while db is only Starting; after db and flaky are marked ready, a second StartAll starts web, which is marked ready - all three Running'
    - kw: And
      text: 'flaky crashes with code 1 at t=0, then each scheduled restart (Tick at t=1, t=3, t=7, marked ready then crashing code 1 again) drives RestartCount to 1, 2, 3; the 4th crash at t=7 exceeds the budget, so flaky moves to Failed with RestartCount 3'
    - kw: Then
      text: 'Shutdown() sends SIGTERM to the running services in reverse order ["web","db"] (flaky is Failed and skipped); after both are reaped with code 0 the final Status() is ["db stopped 0", "web stopped 0", "flaky failed 3"]'
code:
  lang: go
  source: |
    sup.StartAll()                        // db, flaky Starting; web held
    sup.MarkReady("db"); sup.MarkReady("flaky")
    sup.StartAll(); sup.MarkReady("web")  // web released -> Running
    sup.Reap("flaky", 1)                  // crash 1 -> backoff 1s
    for _, t := range []int{1, 3, 7} {    // restarts 1,2,3 then give up
      clock.Advance(untilT(t)); sup.Tick()
      sup.MarkReady("flaky"); sup.Reap("flaky", 1)
    }
    sup.Shutdown(); sup.Reap("web", 0); sup.Reap("db", 0)
    // flaky Failed(3); Status() == ["db stopped 0","web stopped 0","flaky failed 3"]
checkpoint: Your supervisor runs a whole scripted system to its exact final state - crash loop, give-up, dependency wait, and clean shutdown. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real **process
supervisor**. The script exercises every layer at once. Dependency ordering holds
`web` down until `db` is genuinely `Running`, not merely spawned. The restart policy
and backoff bring `flaky` back after each crash - at `t=1`, `t=3`, then `t=7`, the
intervals `1, 2, 4` seconds apart exactly as the doubling predicts. And crash-loop
protection ends the madness: after three restarts inside the window, the fourth crash
does not schedule a fifth attempt - `flaky` is given up as `Failed`, permanently. The
exact final `Status` is only reachable if the state machine, the policies, the clock,
the backoff, the window, and the ordering all agree.

Then the shutdown closes the loop: SIGTERM to the running services in reverse
dependency order, `web` before `db`, `flaky` skipped because a `Failed` service has
nothing to stop, and both reaped cleanly to `Stopped`. From a bare service record
that only knew its own name, you have built the honest core of a real supervisor - a
six-state lifecycle over an injectable runtime, four restart policies, exponential
backoff with crash-loop give-up, a dependency graph with topological start and
reverse-order shutdown, and a reconcile loop - the same design that sits inside
runit, supervisord, and systemd, minus the operating-system layer that fork/execs
real processes and delivers real signals. That layer is the runnable entry point
this reference adds on top; the engine underneath is yours, and it is exact.
