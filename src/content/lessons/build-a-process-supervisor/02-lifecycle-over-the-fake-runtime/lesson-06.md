---
project: build-a-process-supervisor
lesson: 6
title: Starting a service
overview: Now the supervisor does its first real work. Starting a service spawns its command through the runtime and moves it into the Starting state, remembering the handle so it can signal that process later. Today you wire the supervisor to the runtime.
goal: Start a Stopped service - spawn its command via the runtime and move it to Starting.
spec:
  scenario: Start spawns the command and enters Starting
  status: failing
  lines:
    - kw: Given
      text: 'a supervisor over a FakeRuntime with a Stopped service "web" (command "run-web")'
    - kw: When
      text: 'Start("web") is called'
    - kw: Then
      text: 'the runtime was asked to Start "run-web", the service records that handle, and its State is Starting'
    - kw: And
      text: 'the same handle is retrievable later (the service remembers which process is its own)'
code:
  lang: go
  source: |
    // Service gains a Handle field; Supervisor holds the runtime
    func (s *Supervisor) Start(name string) {
      svc, _ := s.Get(name)
      svc.Handle = s.rt.Start(svc.Command) // spawn via the runtime
      svc.State = Starting                 // Stopped -> Starting
    }
    // a plain start for now; making it safe to call twice is a later lesson
checkpoint: Starting a service spawns its command through the runtime and enters Starting. Commit and stop here.
---

Starting a service is two things happening together: a **process is spawned** and
the service's **state advances**. The supervisor asks its runtime to `Start` the
service's command, and the runtime hands back a `Handle` - the token the supervisor
will later use to signal or identify that exact process. The service stashes that
handle, because when it is time to stop or reap this service, the supervisor must
know which process is its own.

Notice the state goes to `Starting`, not straight to `Running`. Spawning a process
and that process being *ready to serve* are different moments - a database has to
open its files, a web server has to bind its port. Modelling that gap is what lets a
dependent service wait for its dependency to be genuinely ready later. For now,
`Starting` means "we have launched it; readiness is the next lesson."
