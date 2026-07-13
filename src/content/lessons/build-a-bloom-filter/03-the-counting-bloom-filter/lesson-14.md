---
project: build-a-bloom-filter
lesson: 14
title: Counter saturation
overview: A small counter can only count so high. When it reaches its ceiling it must saturate - stick at the maximum - and, to stay safe, never decrement again, since it can no longer track its true value. Today you pin that boundary.
goal: Cap each counter at its maximum on Add, and refuse to decrement a saturated counter on Delete.
spec:
  scenario: A counter saturates at its ceiling and stays there
  status: failing
  lines:
    - kw: Given
      text: 'a counting filter NewCounting(16, 3) using 4-bit counters that saturate at 15, and "cat" (indices 7, 14, 5)'
    - kw: When
      text: '"cat" is added 16 times'
    - kw: Then
      text: 'counters 5, 7, and 14 read 15, not 16 - each stopped at the ceiling'
    - kw: And
      text: 'after one Delete("cat") those counters still read 15, because a saturated counter is never decremented'
code:
  lang: go
  source: |
    const maxCount = 15 // 4-bit counters
    // Add:    if counts[i] < maxCount { counts[i]++ }
    // Delete: if counts[i] > 0 && counts[i] < maxCount { counts[i]-- }
checkpoint: Your counters saturate safely instead of overflowing. Commit and stop here.
---

Real counting filters use narrow counters - four bits is the classic choice - to keep the space overhead small, so a counter can only reach `15` before it runs out of room. When an `Add` would push it past that ceiling, it must **saturate**: stay at the maximum rather than wrap around to zero, which would falsely mark a heavily-shared slot empty. Sixteen adds of `"cat"` therefore leave its counters reading `15`, not `16`.

Saturation has a subtle consequence for `Delete`. Once a counter has maxed out, it has lost track of how many items really landed there, so decrementing it might drop it below the true count and cause a false negative later. The safe rule is that a saturated counter is **frozen** - it neither climbs higher nor comes back down. That is an honest, permanent loss of accuracy in exchange for never breaking the no-false-negatives guarantee, and it is the trade every fixed-width counter makes.
