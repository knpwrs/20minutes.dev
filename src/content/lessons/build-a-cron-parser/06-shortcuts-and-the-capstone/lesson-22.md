---
project: build-a-cron-parser
lesson: 22
title: 'Capstone: the next N fire times'
overview: The capstone ties the whole library together - list the upcoming fire times of a real expression by feeding each fire back into Next. You exercise the day-of-month OR day-of-week quirk across a run of fires and a macro across a year boundary.
goal: Compute the next N fire times of an expression from a fixed start, feeding each result back in as the next start.
spec:
  scenario: The next three fire times of real expressions
  status: failing
  lines:
    - kw: Given
      text: 'the expression ''0 0 13 * 5'' - the 13th of the month OR any Friday - and the start 2024-01-10 00:00'
    - kw: When
      text: 'NextN is asked for three fire times'
    - kw: Then
      text: 'it returns 2024-01-12 00:00, 2024-01-13 00:00, and 2024-01-19 00:00 - two Fridays with the 13th (a Saturday) between them'
    - kw: And
      text: '''@monthly'' from 2024-11-15 00:00 returns 2024-12-01 00:00, 2025-01-01 00:00, and 2025-02-01 00:00, crossing the year boundary'
code:
  lang: go
  source: |
    func NextN(e Expr, start time.Time, n int) []time.Time {
      var out []time.Time
      cur := start
      for i := 0; i < n; i++ {
        t, ok := Next(e, cur)
        if !ok {
          break // impossible expression: stop early
        }
        out = append(out, t)
        cur = t // feed each fire back in as the next start
      }
      return out
    }
checkpoint: NextN lists the upcoming fire times of any expression, completing the scheduler. Commit and stop here.
---

This is the payoff for everything you built. `Next` already answers "when does this
fire next," so listing the next several fire times is just calling it in a loop and
using each answer as the start for the next question. Because `Next` searches strictly
after its start, feeding a fire time straight back in returns the following one, and
the loop walks the schedule forward as far as you ask. If the expression is
impossible, `Next` reports no fire and `NextN` simply stops early with a short list.

The two expressions here exercise the trickiest behavior in one place. `0 0 13 * 5`
has both day fields restricted, so the OR quirk decides each fire: the 12th matches as
a Friday, the 13th matches as the 13th even though it is a Saturday, and the 19th
matches as the next Friday - three consecutive fires that would be impossible if the
fields combined with AND. Then `@monthly` shows a macro resolving through the full
pipeline and the scan rolling cleanly from December into the following January and
February. Confirm both sequences and the scheduler is complete.
