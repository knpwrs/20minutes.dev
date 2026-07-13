---
project: build-a-process-supervisor
lesson: 28
title: Graceful shutdown - signal everyone
overview: Shutting the whole system down starts by politely asking every running service to stop, in the right order. Today you add Shutdown, which sends SIGTERM to all running services in reverse dependency order and marks them Stopping.
goal: Shut the system down by sending SIGTERM to every running service in reverse dependency order.
spec:
  scenario: Shutdown signals all running services in reverse order
  status: failing
  lines:
    - kw: Given
      text: 'Running services "db", "web" (requires db), "worker" (requires db), start order ["db","web","worker"]'
    - kw: When
      text: 'Shutdown() is called'
    - kw: Then
      text: 'SIGTERM is sent to each running service in reverse order ["worker","web","db"], all three become Stopping, and the shutdown deadline is recorded as Now() + the 5s grace'
    - kw: And
      text: 'a service that was already Stopped or Failed is skipped - no signal is sent to it'
code:
  lang: go
  source: |
    func (s *Supervisor) Shutdown() {
      s.deadline = s.clock.Now() + 5*time.Second // grace period
      order, _ := s.StartOrder()
      for i := len(order) - 1; i >= 0; i-- {
        if svc, _ := s.Get(order[i]); svc.State == Running {
          s.Stop(order[i]) // SIGTERM, -> Stopping
        }
      }
    }
checkpoint: Shutdown signals every running service in reverse order and starts the grace clock. Commit and stop here.
---

System shutdown is the reverse-order stop from lesson 25, scaled up and put on a
clock. `Shutdown` walks the services in reverse dependency order and sends each
running one a **SIGTERM** - the polite "please exit" - so dependents wind down before
the services they lean on. Services that are already `Stopped`, `Exited`, or `Failed`
have nothing to signal and are skipped.

The new ingredient is the **grace period**. A well-behaved process exits promptly on
SIGTERM, but the supervisor cannot wait forever for a stuck one, so at the moment of
shutdown it records a **deadline** - `Now()` plus a fixed grace, here five seconds -
by which every process is expected to be gone. Sending the signals is only half of a
graceful shutdown; the other half is what happens to the processes that ignore
SIGTERM and are still alive when that deadline passes. That escalation is the next,
final mechanism.
