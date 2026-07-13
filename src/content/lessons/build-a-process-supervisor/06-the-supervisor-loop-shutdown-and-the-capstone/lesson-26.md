---
project: build-a-process-supervisor
lesson: 26
title: Reconciling desired against actual
overview: A supervisor is declarative - you tell it which services you want running, and it works to make reality match. Today you add that desired state and a reconcile pass that starts whatever should be up but is not.
goal: Give each service a desired state and a reconcile pass that starts any that should be Running but are Stopped or Exited.
spec:
  scenario: Reconcile drives actual state toward desired
  status: failing
  lines:
    - kw: Given
      text: 'a service "web" with Desired = Running but currently Stopped, and its dependencies (if any) are Running'
    - kw: When
      text: 'Reconcile() is called'
    - kw: Then
      text: 'the supervisor starts "web" (it becomes Starting)'
    - kw: And
      text: 'a service with Desired = Stopped is left alone, and a Failed service is never restarted by Reconcile (it stays Failed)'
code:
  lang: go
  source: |
    // Service gains Desired State. Reconcile brings actual toward desired.
    func (s *Supervisor) Reconcile() {
      s.Tick() // perform any due backoff restarts first
      order, _ := s.StartOrder() // topological; a cycle is a no-op pass
      for _, name := range order {
        svc, _ := s.Get(name)
        if svc.Desired == Running && (svc.State == Stopped || svc.State == Exited) {
          if s.depsRunning(svc) { s.Start(name) }
        }
      }
    }
checkpoint: A reconcile pass starts every service that should be running but is not. Commit and stop here.
---

The heart of a modern supervisor is a **reconcile loop**: you declare the *desired*
state - "web and db should be running" - and the supervisor repeatedly compares that
against the *actual* state and takes one step to close the gap. This is the model
behind systemd targets and Kubernetes controllers, and it is why `Start` had to be
idempotent back in lesson 8: reconcile calls it on everything that should be up and
relies on the already-running ones ignoring the nudge.

A single `Reconcile` pass does the obvious things: perform any restarts whose backoff
has elapsed, then start any service that is desired-`Running` but currently `Stopped`
or `Exited`, respecting dependency readiness. Two states it deliberately leaves
alone: a service whose desired state is `Stopped` (you asked for it down), and a
`Failed` one (the crash-loop limit already gave up on it - reconcile must not quietly
revive it). Run this pass on a timer and the supervisor keeps the whole set
converging on what you asked for. Next you make its work visible.
