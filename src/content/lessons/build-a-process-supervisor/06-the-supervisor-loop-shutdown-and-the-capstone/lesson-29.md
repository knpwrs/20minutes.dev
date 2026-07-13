---
project: build-a-process-supervisor
lesson: 29
title: Escalating to SIGKILL after the grace period
overview: A process that ignores SIGTERM cannot hold shutdown hostage forever. Once the grace period elapses, any service still stopping gets SIGKILL - the signal it cannot catch. Today you add that escalation at the exact deadline.
goal: After the grace deadline passes, send SIGKILL to any service still Stopping.
spec:
  scenario: SIGKILL follows SIGTERM only after the grace deadline
  status: failing
  lines:
    - kw: Given
      text: 'Shutdown() was called at t=0 (grace 5s, deadline 5s) and "web" is still Stopping - it has not exited'
    - kw: When
      text: 'the shutdown is driven forward in time'
    - kw: Then
      text: 'at t=4s a KillOverdue() pass sends no SIGKILL (still within grace), but at t=5s it sends SIGKILL to "web"''s handle'
    - kw: And
      text: 'a service that already exited (reaped to Stopped before the deadline) is never sent SIGKILL'
code:
  lang: go
  source: |
    func (s *Supervisor) KillOverdue() {
      if s.clock.Now() < s.deadline { return } // grace not yet elapsed
      for _, name := range s.Names() {
        svc, _ := s.Get(name)
        if svc.State == Stopping {
          s.rt.Signal(svc.Handle, SIGKILL) // cannot be caught or ignored
        }
      }
    }
checkpoint: A service that ignores SIGTERM is force-killed once the grace period ends. Commit and stop here.
---

SIGTERM is a request a process can ignore - and some do, whether wedged in a tight
loop, mid-flush, or simply buggy. A supervisor that waited indefinitely for them
would never finish shutting down, so it escalates. Once the grace deadline recorded
at shutdown has passed, every service still stuck in `Stopping` is sent **SIGKILL**,
the one signal a process cannot catch, block, or ignore - the kernel tears it down.
This SIGTERM-then-SIGKILL escalation is exactly what systemd's
`TimeoutStopSec` and a normal `kill` followed by `kill -9` do.

The deadline is the boundary to pin precisely. Before it, `KillOverdue` does nothing
- the process still has time to exit cleanly on its own. At the deadline it fires the
kill. So a pass at `t=4s` (grace is `5s`) sends no signal, while a pass at exactly
`t=5s` sends SIGKILL to whatever is still stopping. And a service that already exited
- reaped to `Stopped` before the deadline - is gone and never gets killed. With this,
the shutdown path is complete: signal in reverse order, wait out the grace, and force
the stragglers. Everything is now in place for the capstone.
