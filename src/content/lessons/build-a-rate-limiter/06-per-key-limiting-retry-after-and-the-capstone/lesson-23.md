---
project: build-a-rate-limiter
lesson: 23
title: 'Capstone: three algorithms, one stream'
overview: The finale runs a single scripted request stream through the fixed-window, sliding-window-counter, and token-bucket limiters at once and asserts each one's exact allow/deny timeline. The three agree on the easy part and split precisely at the window boundary - the whole project in one comparison.
goal: Replay one timestamp stream through three limiters and assert where they agree and diverge.
spec:
  scenario: The three algorithms diverge at the boundary burst
  status: failing
  lines:
    - kw: Given
      text: 'a FixedWindow (limit 3, window 10), a SlidingCounter (limit 3, window 10), and a TokenBucket (capacity 3, rate 0.3), each fresh, and the request stream [9, 9, 9, 10, 10, 10]'
    - kw: When
      text: 'Replay runs that same stream through each limiter'
    - kw: Then
      text: 'all three allow the first three requests at tick 9, so each timeline starts [true, true, true]'
    - kw: And
      text: 'at tick 10 they diverge: the fixed window returns [true, true, true, true, true, true] (its boundary burst admits a second full allowance), while the sliding counter and the token bucket both return [true, true, true, false, false, false] - the sliding counter because its overlap term still weighs the full previous window, the token bucket because only 0.3 of a token has refilled'
code:
  lang: go
  source: |
    stream := []int64{9, 9, 9, 10, 10, 10}
    fw := Replay(&FixedWindow{limit: 3, window: 10}, stream)
    sc := Replay(&SlidingCounter{limit: 3, window: 10}, stream)
    tb := Replay(NewTokenBucket(3, 0.3), stream)
    // fw == [T T T T T T]; sc == [T T T F F F]; tb == [T T T F F F]
checkpoint: Your rate-limiting library runs one stream through three algorithms and pins exactly where they agree and diverge. The project is complete; commit and stop here.
---

This is the comparison the whole project was built to make. One request stream -
three at the end of a window (tick 9), three at the very start of the next (tick 10)
- runs through all three production algorithms at once, and their timelines tell the
story. On the first three requests they **agree**: every limiter admits a burst up
to its limit, so each timeline opens `[true, true, true]`.

At the boundary they **diverge**, exactly as designed. The **fixed window** resets
at tick 10 and hands out a whole fresh allowance, admitting all six requests - the 2x
boundary burst from chapter two, still there. The **sliding counter** refuses: at the
start of window 1 its overlap term is 1.0, so the previous window's three requests
still count in full and the estimate sits at the limit. The **token bucket** also
refuses: after draining at tick 9, only `1 * 0.3 = 0.3` of a token has refilled by
tick 10, far short of the one a request needs. Two different mechanisms, the same
correct answer - and a clean picture of why the fixed window is the cheap-but-flawed
option and the other two are what real systems run. From a virtual clock and a
count-against-a-limit test, you have built the honest core of a production rate
limiter. That is a real rate limiter, and it is yours.
