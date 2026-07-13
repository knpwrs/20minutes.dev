---
project: build-a-load-balancer
lesson: 2
title: The backend pool
overview: A balancer needs a collection of backends to choose among. Today you build the pool - an ordered set you can add backends to, count, and look up by id.
goal: Build a pool that holds backends, reports its size, and finds a backend by id.
spec:
  scenario: A pool holds and finds backends
  status: failing
  lines:
    - kw: Given
      text: 'a new empty pool, then Add(A) and Add(B) where A and B are backends with ids "A" and "B"'
    - kw: When
      text: 'the pool is queried'
    - kw: Then
      text: 'Len reports 2, Get("A") returns backend A, and Get("B") returns backend B'
    - kw: And
      text: 'Get("Z") returns nil for an id that was never added'
code:
  lang: go
  source: |
    type Pool struct { backends []*Backend }
    func NewPool() *Pool { return &Pool{} }
    func (p *Pool) Add(b *Backend) { p.backends = append(p.backends, b) }
    func (p *Pool) Len() int { return len(p.backends) }
    func (p *Pool) Get(id string) *Backend {
      for _, b := range p.backends {
        if b.ID == id { return b }
      }
      return nil
    }
checkpoint: You have a pool that stores backends in order and looks them up by id. Commit and stop here.
---

The **pool** is the set of backends the balancer distributes requests over. Keep it
as an **ordered** collection, not an unordered set: round-robin, weighted
round-robin, and the deterministic tie-breaks you will build all depend on a
stable order, so preserving insertion order matters. A slice is exactly right.

Two operations cover today: append a backend, and find one by its id. `Get`
returning `nil` for an unknown id is the honest answer and keeps callers simple -
they can check for `nil` rather than juggle a second "found" boolean. Everything
the selection algorithms do starts from walking this ordered list.
