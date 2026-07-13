---
project: build-a-load-balancer
lesson: 9
title: Random selection
overview: Random selection spreads load with no per-request memory - just pick a healthy backend at random. To keep it exactly testable, the randomness is injected, so today you build a selector driven by a source you control.
goal: Select a healthy backend using an injected index source, so the sequence is deterministic under test.
spec:
  scenario: Random selection follows the injected source
  status: failing
  lines:
    - kw: Given
      text: 'a random selector over A, B, C all up, driven by an index source that returns 2, 0, 1, 2 on successive calls'
    - kw: When
      text: 'Select is called four times'
    - kw: Then
      text: 'it returns C, A, B, C - each pick is Available()[source(len)]'
    - kw: And
      text: 'the source is always called with the current number of available backends, so it only ever returns a valid index'
code:
  lang: go
  source: |
    // inject randomness so the test is deterministic and the spec is language-neutral
    type IndexSource func(n int) int   // returns an index in [0, n)
    type Random struct { pool *Pool; src IndexSource }
    func (r *Random) Select() (*Backend, error) {
      avail := r.pool.Available()
      return avail[r.src(len(avail))], nil
    }
    // in production src wraps a real RNG; in tests it replays a fixed script
checkpoint: Random selection picks a healthy backend through an injected, testable source. Commit and stop here.
---

Random selection is appealing because it needs no shared cursor - handy when many
workers balance independently and you do not want them all marching in lockstep.
The catch for a spec-first project is that "random" is not a value you can assert.
The fix is **dependency injection**: the selector takes an `IndexSource`, a
function that returns an index into the available backends. In production it wraps
a real random-number generator; in a test you hand it a fixed script and the output
becomes exactly predictable.

This injection pattern is worth internalizing because the next algorithm,
power-of-two-choices, uses the very same source to sample two backends. Always call
the source with `len(Available())` so it returns a valid index into the current
healthy set, never a position that might be down or out of range.
