---
project: build-a-rate-limiter
lesson: 7
title: The sliding-window log
overview: The sliding-window log kills the boundary burst by counting requests over a rolling trailing window instead of a fixed one. It keeps the timestamp of every recent allow, drops the ones that have aged out, and allows only if fewer than the limit remain.
goal: Keep timestamps of recent allows, evict old ones, and allow while under the limit.
spec:
  scenario: The log counts only requests inside the trailing window
  status: failing
  lines:
    - kw: Given
      text: 'a SlidingLog with limit 3 and window 10, where a request at now counts entries with timestamp greater than now - 10'
    - kw: When
      text: 'Allow is called at ticks 0, 1, 2, then 3'
    - kw: Then
      text: 'ticks 0, 1, 2 are allowed and recorded, so the log holds [0, 1, 2]'
    - kw: And
      text: 'tick 3 is denied because the log already holds 3 entries within the trailing window, and a denied request is not recorded'
code:
  lang: go
  source: |
    type SlidingLog struct {
      limit, window int64
      log           []int64 // timestamps of recent allows
    }
    func (s *SlidingLog) Allow(now int64) Decision {
      cutoff := now - s.window
      kept := s.log[:0]
      for _, t := range s.log {
        if t > cutoff { kept = append(kept, t) } // drop aged-out entries
      }
      s.log = kept
      // allow if len(s.log) < limit, and if so append now
    }
checkpoint: The sliding-window log allows based on a rolling count of recent requests. Commit and stop here.
---

The **sliding-window log** takes the boundary burst apart by refusing to have a
boundary at all. Instead of one count that resets, it stores the **timestamp of
every allowed request** and, on each new request, counts how many of those fall
inside the **trailing window** ending at the current tick - the last `window` ticks,
which slides forward continuously with `now`. If fewer than `limit` requests sit in
that trailing window, allow and record; otherwise deny.

The mechanics are two steps: first **evict** every stored timestamp that has aged
out (older than `now - window`), then compare the surviving count to the limit. A
denied request is **not** recorded - it never happened as far as the limiter is
concerned. This is the most precise algorithm in the project: it counts exactly the
requests in the real trailing window, with no boundary artifact. The cost, which
later lessons address, is memory: one stored timestamp per request in the window.
