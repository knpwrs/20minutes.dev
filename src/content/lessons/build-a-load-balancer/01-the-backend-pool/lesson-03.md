---
project: build-a-load-balancer
lesson: 3
title: Removing a backend
overview: Pools change - a server is decommissioned and must leave the rotation for good. Today you remove a backend by id while preserving the order of the rest.
goal: Remove a backend from the pool by id, leaving the remaining backends in their original order.
spec:
  scenario: A backend can be removed by id
  status: failing
  lines:
    - kw: Given
      text: 'a pool holding backends A, B, C in that order'
    - kw: When
      text: 'Remove("B") is called'
    - kw: Then
      text: 'Len reports 2, Get("B") returns nil, and the remaining order is A then C'
    - kw: And
      text: 'Remove("Z") for an id not in the pool leaves the pool unchanged with Len still 2'
code:
  lang: go
  source: |
    func (p *Pool) Remove(id string) {
      out := p.backends[:0]           // reuse the backing array
      for _, b := range p.backends {
        if b.ID != id { out = append(out, b) }
      }
      p.backends = out
    }
    // Order is preserved because you append survivors in their original order.
checkpoint: You can remove a backend by id without disturbing the order of the others. Commit and stop here.
---

Removing a backend is how a server permanently leaves the pool - decommissioned,
scaled down, or replaced. This is different from marking it **down**: a down
backend is still in the pool and can come back, while a removed one is gone. Later
you will also learn to **drain** a backend, which is different again. Keep the
three ideas separate; today is only the permanent removal.

The one thing to get right is **order preservation**. Round-robin and weighted
selection walk the pool in order, so removing the middle backend must leave the
others in their original relative order, not swap the last one into the gap. A
filter that copies survivors in place does exactly that, and removing an id that
is not present simply keeps every backend.
