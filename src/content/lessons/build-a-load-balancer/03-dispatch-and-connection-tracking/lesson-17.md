---
project: build-a-load-balancer
lesson: 17
title: Recording request outcomes
overview: Health checking starts with noticing failures. Today each dispatch records its outcome on the backend as a running streak - consecutive failures or consecutive successes - the raw signal the ejection and recovery logic will read next.
goal: Track consecutive failures and successes on a backend, and have Dispatch record each outcome.
spec:
  scenario: Dispatch records consecutive outcomes on the backend
  status: failing
  lines:
    - kw: Given
      text: 'a single-backend pool holding A, and Dispatch driven first by an always-failing transport'
    - kw: When
      text: 'Dispatch is called twice, then once more through an always-succeeding transport'
    - kw: Then
      text: 'after the two failures A.FailStreak() is 2 and A.SuccessStreak() is 0'
    - kw: And
      text: 'after the following success A.FailStreak() resets to 0 and A.SuccessStreak() is 1'
code:
  lang: go
  source: |
    // add failStreak, successStreak int to Backend, with accessors
    func (b *Backend) RecordFailure() { b.failStreak++; b.successStreak = 0 }
    func (b *Backend) RecordSuccess() { b.successStreak++; b.failStreak = 0 }
    // in Dispatch, after the transport returns:
    //   if err != nil { b.RecordFailure() } else { b.RecordSuccess() }
checkpoint: Every dispatch records a success or failure streak on its backend. Commit and stop here.
---

Health checking begins with **observation**. Before a backend can be ejected for
being unhealthy, the balancer has to notice a pattern, and the pattern that matters
is a **run** of outcomes: a single failed request is noise, but several failures in a
row is a signal. So each backend keeps two counters - a consecutive-failure streak
and a consecutive-success streak - where recording one outcome resets the other. A
failure bumps the fail streak and zeroes the success streak, and vice versa.

Wire this into `Dispatch` so the balancer learns from real traffic: after the
transport returns, record a failure on error and a success otherwise. This is
**passive** health checking - the health signal is a free byproduct of serving
requests, no separate probe needed. The next chapter turns these raw streaks into
state transitions: eject a backend after enough failures, and later bring it back
after enough successes.
