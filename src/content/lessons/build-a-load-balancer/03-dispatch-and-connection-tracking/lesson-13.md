---
project: build-a-load-balancer
lesson: 13
title: The balancer and a connection lease
overview: Now the pieces come together into a Balancer that owns a pool and a selector. Its core move is a lease - pick a backend and mark it busy, handing back a release you call when the work is done.
goal: Build a Balancer whose Begin selects a backend, raises its active count, and returns a release that lowers it exactly once.
spec:
  scenario: Begin leases a backend and release frees it
  status: failing
  lines:
    - kw: Given
      text: 'a Balancer over a round-robin selector for pool A, B, C all up'
    - kw: When
      text: 'Begin is called, then Begin is called again'
    - kw: Then
      text: 'the first returns A with A.Active() now 1, the second returns B with B.Active() now 1'
    - kw: And
      text: 'calling A''s release once drops A.Active() to 0, and calling that same release a second time leaves it at 0 (release is idempotent)'
code:
  lang: go
  source: |
    type Balancer struct { pool *Pool; sel Selector }
    func (bal *Balancer) Begin() (*Backend, func(), error) {
      b, err := bal.sel.Select()
      if err != nil { return nil, nil, err }
      b.Incr()
      done := false
      release := func() { if !done { done = true; b.Decr() } } // decrement once
      return b, release, nil
    }
checkpoint: The Balancer leases a backend, tracking it as busy until released. Commit and stop here.
---

The **Balancer** is the object a caller actually holds. It owns the pool and a
chosen `Selector`, and its job is to turn "give me a backend for this request" into
a backend plus the bookkeeping that keeps the active counts honest. The clean way to
express that is a **lease**: `Begin` selects a backend, raises its active count so
least-connections and friends see it as busy, and returns a `release` closure. The
caller runs the request, then calls `release` to lower the count.

The one correctness rule is that `release` must decrement **exactly once**, no
matter how many times it is called. A double release would push the active count
below the real number of in-flight requests and corrupt every load-aware decision.
Guard it with a `done` flag captured in the closure. This lease shape is what lets
the next lessons run a request through a transport and, crucially, hold several
requests in flight at once to prove least-connections reacts to live load.
