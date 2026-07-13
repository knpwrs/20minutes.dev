---
project: build-a-load-balancer
lesson: 6
title: Round-robin selection
overview: The workhorse balancing algorithm is round-robin - hand each request to the next backend in turn, wrapping back to the first after the last. Today you build it and pin the wrap.
goal: Select backends in turn from the healthy set, wrapping from the last back to the first.
spec:
  scenario: Round-robin cycles through the backends and wraps
  status: failing
  lines:
    - kw: Given
      text: 'a round-robin selector over a pool of A, B, C all up'
    - kw: When
      text: 'Select is called four times in a row'
    - kw: Then
      text: 'it returns A, then B, then C, then A again (wrapping from the last back to the first)'
    - kw: And
      text: 'each Select returns a backend and no error while at least one backend is up'
code:
  lang: go
  source: |
    type Selector interface{ Select() (*Backend, error) }
    type RoundRobin struct { pool *Pool; n int }
    func (r *RoundRobin) Select() (*Backend, error) {
      avail := r.pool.Available()
      // if avail is empty, that is the all-down case (a later lesson)
      b := avail[r.n % len(avail)]
      r.n++                         // advance for next time
      return b, nil
    }
checkpoint: Round-robin hands out backends in turn and wraps around cleanly. Commit and stop here.
---

**Round-robin** is the default in almost every load balancer because it is simple,
fair, and stateless per request. Keep a single counter `n` that only ever goes up;
each `Select` picks `Available()[n % len]` and increments `n`. The modulo is what
makes it **wrap** - after the last backend, `n % len` rolls back to 0 and you are
at the first again. The wrap is the whole point, so the spec pins it directly:
the fourth pick returns to `A`.

Notice the selector chooses from `Available`, not the raw pool, so a down backend
is skipped automatically - you will see that next lesson. One edge to leave for
later: if every backend is down, `Available` is empty and the modulo divides by
zero. Selecting from an empty pool is the explicit all-down error case near the end
of the project; for now the spec keeps at least one backend up.
