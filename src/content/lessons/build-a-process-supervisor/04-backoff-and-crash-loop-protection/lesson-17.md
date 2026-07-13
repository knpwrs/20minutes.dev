---
project: build-a-process-supervisor
lesson: 17
title: Exponential backoff
overview: Restarting a crashing service instantly just burns the CPU. Real supervisors wait longer and longer between attempts - one second, two, four, eight - capped at a maximum. Today you compute that backoff schedule as a pure function of the attempt number.
goal: Compute the delay before the Nth restart - doubling from 1s, capped at 8s.
spec:
  scenario: Backoff doubles and then caps
  status: failing
  lines:
    - kw: Given
      text: 'a backoff of base 1s, factor 2, cap 8s, and Backoff(attempt) for attempt 1, 2, 3, ...'
    - kw: When
      text: 'the delay for each attempt is computed'
    - kw: Then
      text: 'Backoff(1) is 1s, Backoff(2) is 2s, Backoff(3) is 4s, Backoff(4) is 8s'
    - kw: And
      text: 'Backoff(5) is 8s and Backoff(6) is 8s - the delay never exceeds the 8s cap'
code:
  lang: go
  source: |
    // delay = base * 2^(attempt-1), capped
    func Backoff(attempt int) time.Duration {
      d := time.Second << (attempt - 1) // 1s,2s,4s,8s,16s...
      if d > 8*time.Second { return 8 * time.Second }
      return d
    }
checkpoint: Backoff doubles from 1s and caps at 8s. Commit and stop here.
---

A service stuck in a crash loop should not be restarted as fast as the machine can
spawn it - that pins a core and floods the logs while fixing nothing. The standard
answer is **exponential backoff**: wait a little after the first crash, twice as
long after the second, and so on, so a persistently broken service is retried ever
more gently. Systemd, supervisord, and every retry library you have used follow this
shape.

Two details make it practical. First, it is **capped**: without a ceiling the delay
would double into hours, so once it reaches the maximum it stays there - here the
sequence is `1, 2, 4, 8, 8, 8, ...`. Pin the value right *at* the cap (attempt 4 is
`8s`) and just past it (attempt 5 is still `8s`), because an off-by-one in the
doubling is the classic bug. Second, `Backoff` is a **pure function** of the attempt
number - no clock, no state - which makes it trivially exact. The next lesson feeds
its result into the injected clock to actually delay a restart.
