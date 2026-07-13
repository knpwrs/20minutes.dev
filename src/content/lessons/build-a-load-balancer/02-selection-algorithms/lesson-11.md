---
project: build-a-load-balancer
lesson: 11
title: Power-of-two-choices
overview: Scanning every backend for the least busy is costly and, under stale load info, can herd traffic onto one "best" backend. Power-of-two-choices samples just two at random and takes the less loaded - almost as balanced, far cheaper.
goal: Sample two backends via the injected source and select the one with the fewer active connections.
spec:
  scenario: Power-of-two-choices takes the less loaded of two samples
  status: failing
  lines:
    - kw: Given
      text: 'a power-of-two selector over A, B, C with active counts A=5, B=1, C=3, driven by a source that returns 0 then 2'
    - kw: When
      text: 'Select is called once'
    - kw: Then
      text: 'it samples A (active 5) and C (active 3) and returns C, the less loaded of the two'
    - kw: And
      text: 'when the source returns 1 then 1 (the same index twice), the two samples collapse to just B, and Select returns B'
code:
  lang: go
  source: |
    func (p *P2C) Select() (*Backend, error) {
      avail := p.pool.Available()
      i, j := p.src(len(avail)), p.src(len(avail))
      a, b := avail[i], avail[j]
      if b.Active() < a.Active() { return b, nil } // strict < keeps the first sample on a tie
      return a, nil
    }
checkpoint: Power-of-two-choices balances load by sampling two and taking the lighter. Commit and stop here.
---

**Power-of-two-choices** is a beautiful result: pick two backends uniformly at
random and route to the less loaded, and you get almost the balance of scanning
every backend, at the cost of looking at just two. It also dodges a failure mode of
global least-connections - when load information is slightly stale, every balancer
can pick the same "least loaded" backend and stampede it, whereas two random
samples spread the risk.

It reuses the `IndexSource` from the random lesson, calling it twice to sample two
positions. Two edges matter. First, the **tie-break**: when the two samples are
equally loaded, keep the first one deterministically (a strict less-than). Second,
the two samples can land on the **same backend** - the source returns the same index
twice - in which case there is really only one candidate and you return it. Both are
pinned so the behavior is exact rather than "usually two distinct backends."
