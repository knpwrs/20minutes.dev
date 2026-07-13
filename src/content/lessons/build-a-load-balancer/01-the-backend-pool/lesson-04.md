---
project: build-a-load-balancer
lesson: 4
title: Weight and active connections
overview: Two numbers drive almost every balancing decision - how much traffic a backend should get relative to others (its weight), and how many requests it is handling right now (its active count). Today you add both to the backend.
goal: Give a backend a weight that defaults to 1 and a live active-connection count you can raise and lower.
spec:
  scenario: A backend carries a weight and an active count
  status: failing
  lines:
    - kw: Given
      text: 'a freshly created backend'
    - kw: When
      text: 'its weight and active count are queried'
    - kw: Then
      text: 'Weight is 1 by default and Active is 0'
    - kw: And
      text: 'after SetWeight(3), Weight is 3; after Incr called twice, Active is 2; after one Decr, Active is 1'
code:
  lang: go
  source: |
    // add these fields to Backend; set weight in NewBackend
    // weight defaults to 1, active starts at 0
    func (b *Backend) Weight() int { return b.weight }
    func (b *Backend) SetWeight(w int) { b.weight = w }
    func (b *Backend) Active() int { return b.active }
    func (b *Backend) Incr() { b.active++ }
    func (b *Backend) Decr() { b.active-- }
checkpoint: Backends now carry a weight and a live active-connection count. Commit and stop here.
---

Two selection algorithms later in the project lean on numbers you add today.
**Weight** expresses relative capacity: a backend with weight 3 should receive
roughly three times the traffic of a weight-1 backend, so a bigger box can carry
more load. Default it to 1 so an unconfigured pool balances evenly. Remember to set
the default inside `NewBackend`, not just declare the field, or every backend
starts at weight 0 and weighted selection breaks.

**Active** is the count of requests the backend is currently handling. Unlike
weight, it moves constantly - up when the balancer hands the backend a request,
down when that request finishes. Today you only expose the raise and lower
operations; the dispatch chapter is where they get called automatically. The
least-connections algorithm you will build reads this count to pick the least busy
backend.
