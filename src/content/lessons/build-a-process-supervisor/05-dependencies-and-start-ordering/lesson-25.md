---
project: build-a-process-supervisor
lesson: 25
title: Stopping in reverse order
overview: Shutting down must undo startup, so a dependency cannot be torn down while something still depends on it. Today StopAll signals services in the reverse of the start order, so dependents stop before the services they rely on.
goal: Stop all services in reverse topological order - dependents before their dependencies.
spec:
  scenario: Shutdown unwinds the start order
  status: failing
  lines:
    - kw: Given
      text: 'Running services "db", "web" (requires db), and "worker" (requires db), whose start order is ["db", "web", "worker"]'
    - kw: When
      text: 'StopAll() is called'
    - kw: Then
      text: 'SIGTERM is delivered in the reverse order ["worker", "web", "db"] - each dependent is signalled before "db"'
    - kw: And
      text: 'every stopped service is now Stopping (a SIGTERM was sent to each; "db" is signalled last)'
code:
  lang: go
  source: |
    func (s *Supervisor) StopAll() {
      order, _ := s.StartOrder()
      for i := len(order) - 1; i >= 0; i-- { // reverse it
        s.Stop(order[i])
      }
    }
    // assert the runtime saw SIGTERMs in reverse-of-start order
checkpoint: Shutdown stops services in reverse dependency order. Commit and stop here.
---

Startup climbs the dependency graph from the bottom up; shutdown must climb back
down, **top first**. If the supervisor stopped `db` while `web` and `worker` were
still running against it, those dependents would break in the seconds before they
themselves stop - connections refused, queries failing. The safe order is the exact
reverse of the start order: stop the dependents, then stop what they depended on.

This is why the deterministic start order from lesson 22 was worth pinning down -
reversing it gives the correct shutdown order for free, with no separate graph walk.
Pin that the runtime receives SIGTERM in reverse-of-start order, with `db` signalled
last. This same reverse-order discipline is what the graceful full-system shutdown at
the end of the project builds on, adding the grace timeout and the escalation to
SIGKILL for a process that will not leave.
