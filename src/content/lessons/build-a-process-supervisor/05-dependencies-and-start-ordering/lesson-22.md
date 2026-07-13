---
project: build-a-process-supervisor
lesson: 22
title: Topological start order
overview: If web needs db, the supervisor must start db first. Today you compute a start order from the dependency graph so that every service comes after all the services it depends on - a topological sort.
goal: Produce a start order in which each service appears after all of its dependencies.
spec:
  scenario: Dependencies come before their dependents
  status: failing
  lines:
    - kw: Given
      text: 'services with deps: "web" requires "db", "worker" requires "db", and "db" requires nothing, added in the order web, worker, db'
    - kw: When
      text: 'StartOrder() is computed'
    - kw: Then
      text: '"db" appears before both "web" and "worker" in the result'
    - kw: And
      text: 'the order is deterministic - among services with their dependencies already satisfied, insertion order breaks ties, giving ["db", "web", "worker"]'
code:
  lang: go
  source: |
    // Kahn's algorithm: repeatedly emit a service whose deps are all emitted.
    // Walk services in insertion order so ties are deterministic.
    func (s *Supervisor) StartOrder() []string {
      var order []string
      done := map[string]bool{}
      for len(order) < len(s.order) {
        for _, name := range s.order { // insertion order = tie-break
          if done[name] { continue }
          svc, _ := s.Get(name)
          if allDepsIn(svc.Requires, done) {
            order = append(order, name); done[name] = true
          }
        }
      }
      return order
    }
checkpoint: The supervisor computes a start order that respects every dependency. Commit and stop here.
---

Once services depend on each other, "start everything" needs an order: a service can
only come up after all the services it depends on are already up. Producing that
order from the graph is a **topological sort** - arrange the services so every
dependency appears before its dependent. Kahn's algorithm does it simply: repeatedly
pick a service whose dependencies have all been placed, until they are all placed.

Determinism is worth guarding here. A dependency graph usually has many valid
topological orders, and a plain map walk would return a different one each run,
making the spec flaky. Break ties by **insertion order** - among the services whose
dependencies are already satisfied, take the one added earliest - so the result is a
single, predictable sequence you can assert exactly. That same ordered walk is what
you will reverse for shutdown. But first: what if the dependencies contradict each
other and no order exists at all?
