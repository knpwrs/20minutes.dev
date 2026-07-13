---
project: build-a-process-supervisor
lesson: 23
title: Detecting a dependency cycle
overview: If A needs B and B needs A, no start order can exist - neither can go first. Today you detect that impossible situation and report it as an error instead of looping forever.
goal: Detect a dependency cycle and report it rather than failing to produce an order.
spec:
  scenario: A cycle is reported, not silently mishandled
  status: failing
  lines:
    - kw: Given
      text: 'services "a" requires "b" and "b" requires "a"'
    - kw: When
      text: 'StartOrder() is computed'
    - kw: Then
      text: 'it reports an error identifying a dependency cycle (rather than hanging or omitting services)'
    - kw: And
      text: 'a valid acyclic graph (web requires db, db requires nothing) still returns its order with no error'
code:
  lang: go
  source: |
    // Kahn's algorithm detects a cycle naturally: if a full pass places
    // no new service but some remain, the rest are tangled in a cycle.
    func (s *Supervisor) StartOrder() ([]string, error) {
      // ... each round, track whether anything was placed;
      // if progress == false && remaining > 0 { return nil, errCycle }
    }
checkpoint: A dependency cycle is detected and reported instead of looping. Commit and stop here.
---

The topological sort from the last lesson quietly assumed an order exists - but if
two services depend on each other, none does. `a` cannot start until `b` is up, and
`b` cannot start until `a` is up: a **dependency cycle**, and an impossible one. A
naive sort loops forever waiting for a service whose turn never comes, so the
supervisor must recognize the deadlock and refuse it up front.

Kahn's algorithm detects this almost for free. Each round places every service whose
dependencies are already satisfied; if a round places **nothing** yet services
remain, those leftovers are locked in a cycle, since none of them will ever have all
its dependencies met. Return a clear error instead of an order. This is the second
soundness check - unknown dependencies were the first - and together they guarantee
that when the supervisor does start everything, the graph it is walking actually has
a valid order. Now the order can drive real starts.
