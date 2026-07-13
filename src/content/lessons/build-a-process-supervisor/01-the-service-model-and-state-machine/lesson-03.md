---
project: build-a-process-supervisor
lesson: 3
title: A supervisor of several services
overview: One service is not a supervisor. The supervisor owns a set of services, each under a unique name, and every command it will ever run addresses a service by that name. Today you build the container that holds them and looks one up.
goal: Build a supervisor that registers services by name and returns them on lookup.
spec:
  scenario: The supervisor registers and finds services by name
  status: failing
  lines:
    - kw: Given
      text: 'a new Supervisor with Add(NewService("web", "run-web")) and Add(NewService("db", "run-db"))'
    - kw: When
      text: 'Get("db") is called'
    - kw: Then
      text: 'it returns the db service (Command "run-db"), and Get("missing") reports not found'
    - kw: And
      text: 'Names() returns the registered names ["web", "db"] in insertion order'
code:
  lang: go
  source: |
    type Supervisor struct {
      services map[string]*Service
      order    []string // preserves insertion order for Names()
    }
    func NewSupervisor() *Supervisor { /* init both fields */ }
    func (s *Supervisor) Add(svc *Service) { /* store + append name */ }
    func (s *Supervisor) Get(name string) (*Service, bool) { /* map lookup */ }
checkpoint: The supervisor registers services by name and looks them up. Commit and stop here.
---

A real supervisor manages many services at once - a database, a web server, a
worker or two - and it addresses each by a unique **name**. That name is the handle
every operation uses: `Start("web")`, `Stop("db")`, "reap the process that was
`worker`". So the supervisor is, at heart, a name-to-service map.

Keep a separate slice of names in insertion order. A plain map has no stable
iteration order, and later lessons - the status report, topological start order,
reverse-order shutdown - all need to walk services predictably. Establishing a
deterministic order now saves every one of those lessons from flakiness.
