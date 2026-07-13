---
project: build-a-load-balancer
lesson: 5
title: The healthy view of the pool
overview: Selection must only ever consider backends that can take work. Today you build Available - the filtered, order-preserving view of the pool that every selection algorithm will choose from.
goal: Return the backends that are up, in pool order, skipping any that are down.
spec:
  scenario: Available lists only the up backends
  status: failing
  lines:
    - kw: Given
      text: 'a pool holding backends A, B, C all up'
    - kw: When
      text: 'Available is queried'
    - kw: Then
      text: 'it returns [A, B, C] in that order'
    - kw: And
      text: 'after B is marked down, Available returns [A, C] with the order preserved'
code:
  lang: go
  source: |
    func (p *Pool) Available() []*Backend {
      var out []*Backend
      for _, b := range p.backends {
        if b.IsUp() { out = append(out, b) }
      }
      return out
    }
checkpoint: The pool can hand back just its healthy backends, in order. Commit and stop here.
---

Every selection algorithm in the next chapter answers the same question - "which
backend gets this request?" - and none of them should ever answer with a backend
that is down. Rather than teach each algorithm to check health itself, build the
filter once: `Available` returns the subset of the pool that is currently up,
keeping the original order so round-robin and weighted selection stay
deterministic.

This one method is the seam between health and selection. Later, when a backend is
`Draining` as well as `Down`, `Available` is the single place that decides it no
longer takes new work - so a draining backend disappears from selection for free,
without touching any algorithm. Selecting from an empty `Available` (every backend
down) is the all-down case you will handle explicitly near the end.
