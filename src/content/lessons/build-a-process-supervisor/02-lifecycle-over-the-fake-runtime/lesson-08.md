---
project: build-a-process-supervisor
lesson: 8
title: Starting is idempotent
overview: Asking to start a service that is already up must not launch a second copy. A supervisor is declarative - "I want web running" - so a redundant start is simply satisfied already. Today you make Start a no-op when the service is not Stopped.
goal: Make Start on an already-running service do nothing - no second process is spawned.
spec:
  scenario: Starting a Running service spawns nothing
  status: failing
  lines:
    - kw: Given
      text: 'a service "web" that has been started and marked ready (State Running, holding one handle from the runtime)'
    - kw: When
      text: 'Start("web") is called again'
    - kw: Then
      text: 'the runtime was asked to Start exactly once in total, and the service still holds its original handle (State stays Running)'
    - kw: And
      text: 'calling Start on a service that is Starting also spawns nothing - only a Stopped or Exited service may be started'
code:
  lang: go
  source: |
    func (s *Supervisor) Start(name string) {
      svc, _ := s.Get(name)
      // guard: a start is only meaningful from a stopped/exited service
      if !CanTransition(svc.State, Starting) {
        return // already up (or coming up); nothing to do
      }
      svc.Handle = s.rt.Start(svc.Command)
      svc.State = Starting
    }
checkpoint: Starting an already-running service is a harmless no-op. Commit and stop here.
---

A supervisor expresses **desired state**, not one-off commands. When you say a
service should run, asking twice does not mean "run two copies" - it means the same
thing said again. So `Start` on a service that is already `Running` (or `Starting`)
must do nothing: no new process, no new handle, no state change. Spawning a second
copy would leak a process the supervisor has lost track of, because a service holds
exactly one handle.

The transition guard from lesson 4 gives you this almost for free: `Starting` is
only reachable from `Stopped` or `Exited`, so a service that is `Running` simply
fails the `CanTransition` check and `Start` returns early. This idempotence is the
quiet foundation of the reconcile loop much later, where the supervisor repeatedly
calls `Start` on everything that should be up and relies on the already-up ones
staying untouched.
