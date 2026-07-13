---
project: build-a-rate-limiter
lesson: 11
title: Deciding from the estimate
overview: With the weighted estimate in hand, the limiter's decision is simple - allow while the estimate stays below the limit. Today you wire the estimate into Allow and watch the previous window's lingering weight reduce this window's real allowance.
goal: Allow a request only when the weighted estimate is below the limit.
spec:
  scenario: The previous window's weight eats into the current allowance
  status: failing
  lines:
    - kw: Given
      text: 'a SlidingCounter with limit 3 and window 10, after three Allows at ticks 0, 1, 2 fill window 0'
    - kw: When
      text: 'three requests arrive at tick 15 (window 1, overlap (10 - 5) / 10 = 0.5)'
    - kw: Then
      text: 'the first two are allowed - their estimates are 0 + 3*0.5 = 1.5 and 1 + 1.5 = 2.5, both below 3 - and each increments curCount'
    - kw: And
      text: 'the third is denied because its estimate is 2 + 1.5 = 3.5, which is not below the limit, so a request is allowed only while the estimate stays strictly under the limit'
code:
  lang: go
  source: |
    func (s *SlidingCounter) Allow(now int64) Decision {
      s.roll(now)
      overlap := float64(s.window-now%s.window) / float64(s.window)
      est := float64(s.curCount) + float64(s.prevCount)*overlap
      if est < float64(s.limit) {
        s.curCount++
        return Decision{Allowed: true}
      }
      return Decision{Allowed: false}
    }
checkpoint: The sliding counter allows or denies from its weighted estimate. Commit and stop here.
---

The decision falls straight out of yesterday's estimate: **allow while
`estimate < limit`**, and each allowed request adds one to the current window's
count (a denied one adds nothing). Because the estimate folds in a weighted slice of
the previous window, a client that was busy last window carries some of that load
forward - its real allowance this window is reduced by whatever the previous window
still contributes.

See it bite. Window 0 was filled to the limit (ticks 0, 1, 2). Halfway into window 1
at tick 15 the overlap is 0.5, so the previous window still contributes `3*0.5 = 1.5`
before any new request. The first request estimates `0 + 1.5 = 1.5` (allowed, count
1), the second `1 + 1.5 = 2.5` (allowed, count 2), and the third `2 + 1.5 = 3.5` -
not below 3, so **denied**. Instead of a full fresh allowance of 3, this window only
yielded 2, because the tail of the previous window was still weighing on the
estimate. That smooth handoff is exactly what the fixed window's hard reset lacked.
