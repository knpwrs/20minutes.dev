---
project: build-a-rate-limiter
lesson: 5
title: Remaining allowance
overview: A limiter is far more useful if it can tell a caller how many requests are still left before it starts denying. Today you add a Remaining query that reports the current window's leftover allowance, reusing the same window-reset logic.
goal: Report how many requests remain in the current window without consuming one.
spec:
  scenario: Remaining reflects consumption and resets each window
  status: failing
  lines:
    - kw: Given
      text: 'a FixedWindow with limit 3 and window 10'
    - kw: When
      text: 'Remaining(now) is queried as requests are allowed'
    - kw: Then
      text: 'at tick 0 before any request it reports 3, after one Allow it reports 2, and after three Allows it reports 0'
    - kw: And
      text: 'at tick 10 (a new window) Remaining reports 3 again, even though no Allow has run yet in that window'
code:
  lang: go
  source: |
    // Remaining must apply the same window rollover Allow does,
    // so querying in a new window reports a fresh allowance.
    func (f *FixedWindow) Remaining(now int64) int64 {
      w := now / f.window
      if w != f.curWindow {
        f.curWindow = w
        f.count = 0
      }
      return f.limit - f.count
    }
checkpoint: The limiter reports its remaining allowance for the current window. Commit and stop here.
---

Real limiters do not just say yes or no - they tell the caller how much room is
left, so a client can pace itself (this is what an API's `X-RateLimit-Remaining`
header carries). **Remaining** is `limit - count` for the *current* window, and the
subtlety is that it must perform the **same window rollover** `Allow` does: if the
clock has moved into a new window since the last call, the count is stale and must
reset to 0 before the subtraction, or `Remaining` would under-report right after a
boundary.

Querying remaining allowance does **not** consume any of it - it only reports. So
at limit 3 a fresh window reports 3, each allowed request drops it by one to 0, and
crossing into the next window reports a full 3 again even before any request lands
there. Sharing the reset logic between `Allow` and `Remaining` is what keeps the
two consistent.
