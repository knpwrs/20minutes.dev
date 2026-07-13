---
project: build-a-process-supervisor
lesson: 24
title: A dependent waits for its dependency
overview: Start order is not enough - a dependent must not launch until its dependency is genuinely Running, not merely Starting. Today StartAll walks the order but holds a service back until every dependency has reached Running.
goal: In StartAll, start a service only once all of its dependencies are Running.
spec:
  scenario: A dependent is blocked until its dependency is ready
  status: failing
  lines:
    - kw: Given
      text: '"web" requires "db"; StartAll() is called, which starts "db" (now Starting, not yet ready)'
    - kw: When
      text: 'StartAll evaluates "web" while "db" is still Starting'
    - kw: Then
      text: '"web" is not started - it stays Stopped because its dependency is not Running yet'
    - kw: And
      text: 'after MarkReady("db") makes db Running, a further StartAll() call starts "web" (web becomes Starting)'
code:
  lang: go
  source: |
    func (s *Supervisor) StartAll() {
      for _, name := range order { // topological order
        svc, _ := s.Get(name)
        if !depsRunning(svc) { continue } // hold back until deps are Running
        s.Start(name)
      }
    }
    func depsRunning(svc *Service) bool {
      // every dep must be in state Running, not just Starting
    }
checkpoint: A dependent stays down until all its dependencies are Running. Commit and stop here.
---

Ordering the starts is necessary but not sufficient. Starting `db` before `web`
means little if `web` launches the instant `db` is merely *spawned* - `db` might
still be opening its files, and `web` would fail to connect. The real rule is
readiness: a dependent may start only once every dependency has reached **Running**,
the state that means "ready to serve" from lesson 7. This is precisely why that
Starting-versus-Running distinction was worth modelling.

So `StartAll` walks the topological order but skips any service whose dependencies
are not all `Running` yet, leaving it `Stopped` for now. As dependencies become
ready - a later `StartAll` pass, or the reconcile loop ahead - the services waiting
on them are released to start. Pin both sides: while `db` is only `Starting`, `web`
is held back; once `db` is `Running`, `web` is allowed up. Starting climbs the graph
bottom-up; stopping, as you will see next, must unwind it top-down.
