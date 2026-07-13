---
project: build-a-rate-limiter
lesson: 10
title: The weighted estimate
overview: The sliding-window counter is the production sweet spot - almost as accurate as the log but with fixed memory. It keeps just two numbers, this window's count and last window's, and estimates the rolling count by weighting the previous window by how much it still overlaps the trailing window.
goal: Track the current and previous window counts and compute the weighted estimate.
spec:
  scenario: The estimate weights the previous window by its overlap
  status: failing
  lines:
    - kw: Given
      text: 'a SlidingCounter with limit 100 and window 10, after Allow at ticks 0, 1, 2 (all in window 0) and one Allow at tick 10 (window 1)'
    - kw: When
      text: 'Estimate(now) computes curCount + prevCount * (window - now % window) / window'
    - kw: Then
      text: 'at tick 10 the estimate is 4.0 - curCount 1 plus prevCount 3 times an overlap of (10 - 0) / 10 = 1.0'
    - kw: And
      text: 'at tick 15 the estimate is 2.5 - curCount 1 plus prevCount 3 times an overlap of (10 - 5) / 10 = 0.5'
code:
  lang: go
  source: |
    type SlidingCounter struct {
      limit, window        int64
      curWindow            int64
      curCount, prevCount  int64
    }
    func (s *SlidingCounter) roll(now int64) {
      w := now / s.window
      if w != s.curWindow {
        if w == s.curWindow+1 { s.prevCount = s.curCount } else { s.prevCount = 0 }
        s.curCount, s.curWindow = 0, w
      }
    }
    // Estimate: overlap = float64(window - now%window) / float64(window)
checkpoint: The sliding counter maintains two window counts and a weighted estimate. Commit and stop here.
---

The **sliding-window counter** is what large systems actually run: it approximates
the log's rolling count using only **two integers** per client - the count in the
current fixed window and the count in the previous one. The insight is that as the
trailing window slides forward through the current fixed window, it still overlaps
part of the previous window, and that overlap shrinks linearly. So it weights the
previous window's count by the fraction still overlapping:
`estimate = curCount + prevCount * overlap`, where `overlap = (window - now % window)
/ window` runs from 1.0 at a window's start down toward 0 at its end.

Maintaining the two counts is a small **rollover**: when the clock enters a new
window, if it is the immediately following one, the current count becomes the
previous count; if the clock jumped across a gap of two or more windows, the
previous count is instead **zeroed** (nothing from that long-ago window still
overlaps). Today only tracks the counts and the estimate. At tick 10, freshly into
window 1 with 3 requests behind us and 1 just made, the previous window fully
overlaps (1.0) so the estimate is `1 + 3*1.0 = 4.0`; halfway through at tick 15 the
overlap has fallen to 0.5 and the estimate to `1 + 3*0.5 = 2.5`.
