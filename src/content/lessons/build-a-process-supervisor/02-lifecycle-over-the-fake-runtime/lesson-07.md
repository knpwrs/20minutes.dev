---
project: build-a-process-supervisor
lesson: 7
title: Readiness - reaching Running
overview: A spawned process is not yet a working one. When a service reports that it is ready - its port is open, its files are loaded - the supervisor moves it from Starting to Running. Today you add that readiness step and the healthy steady state it unlocks.
goal: Mark a Starting service ready so it advances to Running, and reject readiness from any other state.
spec:
  scenario: Readiness advances Starting to Running only
  status: failing
  lines:
    - kw: Given
      text: 'a service "web" that has been started and is in state Starting'
    - kw: When
      text: 'MarkReady("web") is called'
    - kw: Then
      text: 'its State becomes Running'
    - kw: And
      text: 'calling MarkReady on a Stopped service is a no-op - that service stays Stopped (readiness is only legal from Starting)'
code:
  lang: go
  source: |
    func (s *Supervisor) MarkReady(name string) {
      svc, _ := s.Get(name)
      // only a Starting service can become Running
      if CanTransition(svc.State, Running) {
        svc.State = Running
      }
    }
checkpoint: A started service that reports ready reaches Running. Commit and stop here.
---

Between "launched" and "working" there is a real gap, and a supervisor that ignores
it will route traffic to a database that has not finished opening. So services
report **readiness**: the process signals - by writing a notification, opening its
port, or passing a health check - that it is ready to do its job. On that signal the
supervisor moves the service from `Starting` to `Running`, its healthy steady state.

In the graded core, readiness arrives as an explicit `MarkReady` call rather than a
real health probe, which keeps it deterministic. Guard it with the transition rules
from lesson 4: readiness is only meaningful for a `Starting` service, so calling it
on a `Stopped` or already-`Running` one changes nothing. That guard is what makes
the dependency ordering later trustworthy - a service is `Running` only after it has
genuinely passed through `Starting` and reported ready.
