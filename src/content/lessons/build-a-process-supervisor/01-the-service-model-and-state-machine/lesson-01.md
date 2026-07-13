---
project: build-a-process-supervisor
lesson: 1
title: The managed service
overview: A supervisor's whole job is to keep a set of services in the state you asked for. Before it can do anything it needs a way to describe one service - its name, the command that runs it, and where it is right now. Today you build that record and give a brand-new service its starting state.
goal: Define a service with a name and command, and confirm a fresh one starts out Stopped.
spec:
  scenario: A new service knows its identity and starts Stopped
  status: failing
  lines:
    - kw: Given
      text: 'a new service created with NewService("web", "run-web")'
    - kw: When
      text: 'its Name, Command, and State are read'
    - kw: Then
      text: 'Name is "web", Command is "run-web", and State is Stopped'
    - kw: And
      text: 'a second service NewService("db", "run-db") is independent - its Name is "db" and it is also Stopped'
code:
  lang: go
  source: |
    // the one record the whole supervisor revolves around
    type Service struct {
      Name    string
      Command string
      State   State // Stopped for a fresh service
    }
    func NewService(name, command string) *Service {
      return &Service{Name: name, Command: command}
    }
checkpoint: You have a service record that carries a name, a command, and a starting state of Stopped. Commit and stop here.
---

A **process supervisor** keeps long-running programs alive: it starts them, notices
when they exit, restarts them under a policy, and shuts them down cleanly. Every
one of those actions happens to a single unit of work called a **service** - a name
you refer to it by, the **command** that launches it, and the **state** it is
currently in. Runit calls this a "service directory"; systemd calls it a "unit".

Today is deliberately tiny: just the record and its starting point. A service that
has never been started is `Stopped` - it has an identity and a command, but nothing
is running yet. Every later lesson moves a service between states or acts on that
command, so pinning down what a fresh service looks like is where the whole engine
begins.
