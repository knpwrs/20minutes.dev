---
project: build-a-process-supervisor
lesson: 10
title: Reaping a stop
overview: When a stopping process finally exits, the supervisor must notice and finish the job by moving the service to Stopped. That noticing is called reaping. Today you add Reap - the event that says "this service's process has exited" - and handle it for a clean shutdown.
goal: Reap a Stopping service so it reaches Stopped.
spec:
  scenario: Reaping completes a stop
  status: failing
  lines:
    - kw: Given
      text: 'a service "web" in state Stopping (a SIGTERM was already sent)'
    - kw: When
      text: 'Reap("web", 0) is called - the process has exited'
    - kw: Then
      text: 'its State becomes Stopped'
    - kw: And
      text: 'reaping a service that is not running or stopping is ignored - a Stopped service stays Stopped'
code:
  lang: go
  source: |
    // Reap is the supervisor's "a process exited" event.
    // Real code learns this from wait(); a test just calls it.
    func (s *Supervisor) Reap(name string, code int) {
      svc, _ := s.Get(name)
      switch svc.State {
      case Stopping:
        svc.State = Stopped // the stop we asked for completed
      }
    }
checkpoint: A stopping service that exits is reaped to Stopped. Commit and stop here.
---

A supervisor cannot start processes and then forget them - it has to know the moment
each one exits, both to finish a shutdown and to react to a crash. On a real system
that knowledge comes from **reaping**: the parent calls `wait`, learns which child
exited and with what code, and acts. In the graded core, `Reap(name, code)` is that
same event delivered directly, which keeps it deterministic and free of real
processes.

Today handles only the clean case: a service that was `Stopping` has now genuinely
exited, so it moves to `Stopped` and the shutdown is complete. The exit code is
along for the ride but does not matter yet, because we asked for this exit. The
interesting case is the opposite one - a `Running` service exiting on its own,
without being asked - and whether its exit code was success or failure. That
classification is the next lesson, and it is the hinge the entire restart system
turns on.
