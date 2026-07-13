---
project: build-a-load-balancer
lesson: 12
title: Sticky sessions
overview: Some workloads need the same client to keep hitting the same backend - a shopping cart in server memory, say. Sticky selection remembers a key-to-backend mapping so a given key routes stably, even as the pool changes around it.
goal: Route each session key to a remembered backend, picking a fresh one only for keys not seen before.
spec:
  scenario: A session key sticks to its backend
  status: failing
  lines:
    - kw: Given
      text: 'a sticky selector wrapping round-robin over A, B, C all up, with an empty session table'
    - kw: When
      text: 'SelectFor("u1") is called, then SelectFor("u1") again, then SelectFor("u2")'
    - kw: Then
      text: 'the first "u1" call picks A via round-robin and records it, the second "u1" returns A from the table without advancing round-robin, and "u2" picks B'
    - kw: And
      text: 'after a new backend D is added to the pool, SelectFor("u1") still returns A - an unrelated membership change does not move an existing session'
code:
  lang: go
  source: |
    type Sticky struct { pool *Pool; under Selector; table map[string]string }
    func (s *Sticky) SelectFor(key string) (*Backend, error) {
      if id, ok := s.table[key]; ok {
        if b := s.pool.Get(id); b != nil && b.IsUp() { return b, nil }
      }
      b, err := s.under.Select() // first time (or pinned backend gone): pick fresh
      if err != nil { return nil, err }
      s.table[key] = b.ID
      return b, nil
    }
checkpoint: Session keys stick to their backend and survive unrelated pool changes. Commit and stop here.
---

**Sticky sessions** (session affinity) keep a client pinned to one backend so any
per-session state living on that server stays reachable. The mechanism is a
**session table**: a map from a session key to the id of the backend it was first
routed to. On a repeat request for the same key you return the remembered backend
directly, without consulting the underlying algorithm at all - which is why the
second `u1` call does not advance the round-robin cursor.

The property that makes this genuinely sticky is **stability under change**. Because
the mapping is stored by id, adding, removing, or reordering an unrelated backend
leaves an existing session's entry untouched - `u1` keeps landing on `A` after `D`
joins. That is deliberately different from hashing the key modulo the pool size,
where adding a backend reshuffles almost every key; a full consistent-hashing ring
that minimizes that reshuffle is its own separate project. The one time a key does
re-pick is when its remembered backend is gone or unhealthy, which the lookup guards
with the `IsUp` check.
