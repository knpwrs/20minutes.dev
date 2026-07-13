---
project: build-a-load-balancer
lesson: 10
title: Least-connections
overview: Round-robin ignores how busy each backend already is. Least-connections fixes that by always picking the backend handling the fewest requests right now, with a deterministic tie-break.
goal: Select the healthy backend with the smallest active count, breaking ties by pool order.
spec:
  scenario: Least-connections picks the least busy backend
  status: failing
  lines:
    - kw: Given
      text: 'a least-connections selector over A, B, C all up with active counts A=2, B=1, C=1'
    - kw: When
      text: 'Select is called once'
    - kw: Then
      text: 'it returns B - B and C tie at 1 active, and B wins because it comes first in pool order'
    - kw: And
      text: 'after B''s active count is raised to 5 (A=2, B=5, C=1), the next Select returns C as the new minimum'
code:
  lang: go
  source: |
    func (l *LeastConn) Select() (*Backend, error) {
      avail := l.pool.Available()
      best := avail[0]
      for _, b := range avail[1:] {
        if b.Active() < best.Active() { best = b } // strict < keeps the earliest on a tie
      }
      return best, nil
    }
checkpoint: Least-connections routes to the least busy backend with a stable tie-break. Commit and stop here.
---

**Least-connections** is load-aware: instead of blindly rotating, it sends each
request to whichever healthy backend currently has the fewest **active
connections**. That naturally steers traffic away from a backend that is slow or
bogged down, because its in-flight count stays high while faster backends drain and
get refilled. It reads the `Active()` count you added in the pool chapter.

The detail that makes it testable is the **tie-break**. When two backends are
equally busy you must pick one deterministically, or the sequence is unstable. Using
a strict less-than while scanning in pool order keeps the **earliest** backend on a
tie - so `B` beats `C` when both sit at 1. Get the comparison direction wrong (using
less-than-or-equal) and the last equal backend wins instead; pin the tie so the
choice is nailed down. The active counts are set by hand in this lesson; the
dispatch chapter is where they start moving on their own.
