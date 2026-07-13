---
project: build-a-rate-limiter
lesson: 12
title: No burst at the boundary
overview: Now confront the sliding counter with the exact boundary burst that broke the fixed window. Where the fixed window resets and admits a second full allowance, the sliding counter's overlap term is at its maximum, so it denies - the whole reason this algorithm exists.
goal: Show the sliding counter denying at a boundary where the fixed window resets.
spec:
  scenario: The sliding counter blocks the boundary burst
  status: failing
  lines:
    - kw: Given
      text: 'a SlidingCounter with limit 3 and window 10, after three Allows at ticks 0, 1, 2 fill window 0'
    - kw: When
      text: 'a request arrives at tick 10, then another at tick 11'
    - kw: Then
      text: 'tick 10 is denied - it is the start of window 1 so overlap is (10 - 0) / 10 = 1.0 and the estimate is 0 + 3*1.0 = 3.0, not below the limit (a fixed window would have allowed it)'
    - kw: And
      text: 'tick 11 is allowed - overlap has dropped to (10 - 1) / 10 = 0.9 and the estimate is 0 + 3*0.9 = 2.7, below the limit'
code:
  lang: go
  source: |
    // same Allow from yesterday - this lesson is a test.
    s := &SlidingCounter{limit: 3, window: 10}
    s.Allow(0); s.Allow(1); s.Allow(2) // window 0 full
    a := s.Allow(10) // overlap 1.0, est 3.0 -> denied
    b := s.Allow(11) // overlap 0.9, est 2.7 -> allowed
checkpoint: The sliding counter refuses the boundary burst the fixed window admits. Commit and stop here.
---

This is the sliding counter's headline result, measured against the very sequence
from the fixed-window flaw. Fill window 0 to the limit, then push a request at the
window boundary, tick 10. The fixed window would reset and allow it - that was the
2x burst. The sliding counter sees something different: at the *start* of window 1
the overlap term is at its maximum, `(10 - 0) / 10 = 1.0`, so the previous window's
full count still weighs in, `0 + 3*1.0 = 3.0`, which is not below the limit. The
request is **denied**.

The allowance only opens as real time passes and the overlap decays. One tick later
at tick 11 the overlap is 0.9, the estimate `0 + 3*0.9 = 2.7`, and the request is
allowed. So the sliding counter reproduces almost exactly what the expensive log
does - no boundary burst - while storing only two integers instead of a timestamp
per request. That balance of accuracy and cost is why it is the algorithm most large
rate limiters actually deploy.
