---
project: build-a-rate-limiter
lesson: 4
title: The fixed-window counter
overview: Give the quota a sense of time and it becomes the most common real limiter - the fixed-window counter. It divides time into aligned windows and resets the count at the start of each one, so a client gets a fresh allowance every window.
goal: Reset the count whenever the clock crosses into a new fixed window.
spec:
  scenario: The count resets at each window boundary
  status: failing
  lines:
    - kw: Given
      text: 'a FixedWindow with limit 3 and window 10, where the window index of a tick is now / 10 (integer division)'
    - kw: When
      text: 'Allow is called at ticks 0, 1, 2, 3, then 9, then 10'
    - kw: Then
      text: 'ticks 0, 1, 2 are allowed, ticks 3 and 9 are denied (still window 0, limit reached)'
    - kw: And
      text: 'tick 10 is allowed because it falls in window 1 (10 / 10 = 1), which resets the count to 0'
code:
  lang: go
  source: |
    type FixedWindow struct {
      limit, window int64
      count         int64
      curWindow     int64
    }
    func (f *FixedWindow) Allow(now int64) Decision {
      w := now / f.window          // which aligned window are we in?
      if w != f.curWindow {        // crossed into a new window: reset
        f.curWindow = w
        f.count = 0
      }
      // then the familiar count < limit test
    }
checkpoint: The fixed-window counter resets its allowance every window. Commit and stop here.
---

A **fixed-window counter** slices time into equal windows aligned to the clock -
with a window of 10 ticks, window 0 covers ticks `[0, 10)`, window 1 covers
`[10, 20)`, and so on. The window a tick belongs to is just `now / window` under
integer division. Inside a window it behaves exactly like yesterday's quota: allow
while `count < limit`, deny once the limit is hit. The new idea is the **reset**:
the moment a request arrives in a window index different from the one we last saw,
zero the count before deciding.

This is the limiter most APIs reach for first because it is trivial to store - one
count and one window index per client. Windows are **aligned to the clock**, not to
each client's first request, so every client's allowance flips over at the same
ticks (10, 20, 30). Pin the reset exactly: at limit 3 the requests at ticks 0, 1, 2
exhaust window 0, ticks 3 through 9 are denied, and tick 10 opens window 1 with a
clean count. Tomorrow you expose how much of the current window's allowance is
left.
