---
project: build-a-load-balancer
lesson: 22
title: When every backend is down
overview: Sooner or later every backend is down at once. The balancer must say so with a clear error - never divide by zero, panic, or loop forever hunting for a healthy backend that does not exist.
goal: Return an explicit no-healthy-backend error from selection and dispatch when the available set is empty.
spec:
  scenario: An all-down pool returns a clear error
  status: failing
  lines:
    - kw: Given
      text: 'a round-robin selector over a pool of A and B with both marked down'
    - kw: When
      text: 'Select is called, and Dispatch is called'
    - kw: Then
      text: 'each returns the sentinel error ErrNoHealthyBackend and no backend - no panic and no infinite loop'
    - kw: And
      text: 'after A is marked back up, Select returns A and Dispatch succeeds again'
code:
  lang: go
  source: |
    var ErrNoHealthyBackend = errors.New("no healthy backend")
    func (r *RoundRobin) Select() (*Backend, error) {
      avail := r.pool.Available()
      if len(avail) == 0 { return nil, ErrNoHealthyBackend } // guard before the modulo
      b := avail[r.n % len(avail)]; r.n++
      return b, nil
    }
    // Begin already forwards Select's error; Dispatch already forwards Begin's.
checkpoint: The balancer fails cleanly and recoverably when nothing is healthy. Commit and stop here.
---

Every algorithm in this project selects from `Available()`, and until now the specs
kept at least one backend up so the set was never empty. Production reality is not so
kind: a bad deploy, a network partition, or a cascading failure can take **every**
backend down at once. The balancer's job then is not to guess or spin - it is to
return a clear, catchable error so the caller can shed load, return a 503, or retry
later.

The bug this guards against is concrete: selecting `Available()[n % len]` on an empty
slice divides by zero (a panic in most languages), and a naive "keep trying until one
is healthy" loop would never terminate. A single sentinel error - the same
`ErrNoHealthyBackend` value every time, so callers can compare against it - is the
honest answer. Add the empty check to each selector's front door; the other
algorithms follow the exact same one-line guard. Because `Begin` and `Dispatch`
already propagate the selector's error, the whole stack reports it, and the moment a
backend comes back up, selection resumes with no special handling.
