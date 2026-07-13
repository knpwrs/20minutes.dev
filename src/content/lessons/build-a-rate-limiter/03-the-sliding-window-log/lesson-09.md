---
project: build-a-rate-limiter
lesson: 9
title: The window boundary is half-open
overview: Eviction has one edge that decides borderline requests - is a timestamp sitting exactly at the cutoff still counted, or has it aged out? Today you pin that boundary precisely so the log allows and denies on the exact right tick.
goal: Pin whether a timestamp exactly window ticks old still counts.
spec:
  scenario: A timestamp exactly at the cutoff is treated as aged out
  status: failing
  lines:
    - kw: Given
      text: 'a SlidingLog with limit 1 and window 10, with one allowed request recorded at tick 0'
    - kw: When
      text: 'Allow is called at tick 9, then at tick 10 (which records a new entry at tick 10), then at ticks 19 and 20'
    - kw: Then
      text: 'tick 9 is denied - its cutoff is 9 - 10 = -1, and the stored timestamp 0 is greater than -1, so it still counts and the single slot is full - and tick 10 is allowed, because its cutoff is 10 - 10 = 0 and 0 is not greater than 0, so the entry ages out and the slot frees exactly at tick 10'
    - kw: And
      text: 'the same boundary repeats one window later, not just at tick 0: tick 19 is denied (cutoff 9, the tick-10 entry is greater than 9 so it still counts) and tick 20 is allowed (cutoff 10, the tick-10 entry is not greater than 10 so it ages out)'
code:
  lang: go
  source: |
    // the trailing window is half-open: (now - window, now].
    // keep t only if t > now - window (strictly greater).
    cutoff := now - s.window
    if t > cutoff {
      // still inside the window
    }
    // at now=10, window=10: cutoff 0; entry 0 is NOT > 0 -> evicted
checkpoint: The eviction boundary is pinned to the exact tick. Commit and stop here.
---

Every windowed limiter has to answer one borderline question: when a request is
*exactly* one window old, is it in or out? Getting this off by a single tick shifts
every decision near a boundary, so pin it. We define the trailing window as
**half-open**: `(now - window, now]`. A timestamp counts only if it is **strictly
greater** than `now - window`; an entry sitting exactly on the cutoff has aged out.

Watch it decide two adjacent ticks. With limit 1 and one request logged at tick 0:
at tick 9 the cutoff is -1, the entry `0` is greater than -1 so it still counts, the
single slot is full, and the request is **denied**. One tick later, at tick 10, the
cutoff is 0, the entry `0` is *not* greater than 0, so it ages out, the slot frees,
and the request is **allowed**. The allowance returns at exactly tick 10, not tick 9
- which is precisely the "window ticks after the request" behavior you want, and the
convention the rest of the project's windows follow.

The boundary is not special to tick 0 - it slides with every entry. The request
that got in at tick 10 records its own timestamp, and it in turn ages out exactly a
window later: at tick 19 it still counts (denied), at tick 20 it has aged out
(allowed). Pin both boundaries so the half-open rule is locked in wherever an entry
lands on the clock.
