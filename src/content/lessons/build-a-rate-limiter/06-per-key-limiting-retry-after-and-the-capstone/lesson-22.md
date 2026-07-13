---
project: build-a-rate-limiter
lesson: 22
title: One interface, many limiters
overview: Every algorithm you built answers Allow(now) the same way, so they are interchangeable. Today you make that explicit with a Limiter interface and a Replay helper that runs a scripted stream of timestamps through any limiter, returning its allow/deny timeline.
goal: Define the common Limiter interface and a driver that replays a timestamp stream.
spec:
  scenario: Replay runs a timestamp stream through any limiter
  status: failing
  lines:
    - kw: Given
      text: 'a FixedWindow with limit 2 and window 10, treated as a Limiter'
    - kw: When
      text: 'Replay(limiter, [0, 1, 2, 10]) runs the four ticks through it in order'
    - kw: Then
      text: 'it returns [true, true, false, true] - ticks 0 and 1 fill window 0, tick 2 is denied, and tick 10 opens window 1'
    - kw: And
      text: 'the same Replay works unchanged on a SlidingCounter or a TokenBucket, since all of them satisfy the Limiter interface'
code:
  lang: go
  source: |
    type Limiter interface {
      Allow(now int64) Decision
    }
    func Replay(l Limiter, times []int64) []bool {
      out := make([]bool, len(times))
      for i, t := range times {
        out[i] = l.Allow(t).Allowed
      }
      return out
    }
checkpoint: Any limiter can be driven through a scripted stream by one helper. Commit and stop here.
---

Every algorithm in this project - fixed window, sliding log, sliding counter, token
bucket, leaky bucket - exposes the exact same method, `Allow(now) Decision`. That
shared shape is a **`Limiter` interface**, and once it is named, code can accept
*any* limiter without caring which algorithm it is. Nothing about the limiters
changes; naming the interface just records the contract they already share since
lesson 2.

The payoff is **`Replay`**: a driver that takes any `Limiter` and a scripted list of
request ticks, calls `Allow` for each in order, and returns the allow/deny timeline
as a slice of booleans. Because it speaks only to the interface, the same helper
drives a fixed window, a sliding counter, or a token bucket unchanged. That is
exactly the tool the capstone needs - a way to push one identical request stream
through several algorithms and line up their timelines. Confirm it on a fixed window
today; tomorrow you point it at three limiters at once.
