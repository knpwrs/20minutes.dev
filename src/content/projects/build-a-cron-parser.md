---
title: 'Build a Cron Expression Parser and Scheduler'
order: 51
lessons: 22
size: 'Small'
tech: ['Cron expressions', 'Scheduling', 'Calendar math']
estMin: 20
desc: 'Build a real cron expression parser and scheduler from first principles as an importable library. Split a cron line into its five fields, compile each field to the exact set of values it allows (wildcards, single numbers, lists, ranges, and steps), decode three-letter month and day names, and handle the quirk that both 0 and 7 mean Sunday. Then test whether an explicit timestamp matches an expression - including the classic day-of-month / day-of-week OR rule - and compute the next fire time from a given instant, handling hour and day rollover, end-of-month skipping, and a leap-day February. Every value is deterministic: time is driven by fixed timestamps you pass in, never the wall clock.'
blurb: 'Parse a five-field cron line into exact value sets so `*/15` on minutes is provably {0, 15, 30, 45}, then match fixed timestamps and compute next fire times you can assert to the minute. Each lesson pins one concrete behavior: a stepped range, JAN meaning 1, both 0 and 7 meaning Sunday, the day-of-month OR day-of-week rule when both are restricted, a next fire that rolls across a month boundary, and a Feb 29 that skips ahead to the next leap year.'
overview: |
  Over 22 lessons you build a working cron expression parser and scheduler as an importable library, driven entirely by explicit fixed timestamps so every result is deterministic and assertable to the minute. There is no wall clock and no hidden state: you parse an expression once into exact sets of allowed values, then ask two questions of it - does this timestamp match, and when does it next fire.

  You start by splitting a cron line into its five fields and validating their bounds, then compile each field to the exact set of values it allows: a wildcard, a single number, a list, a range, and a step like `*/15`. You decode three-letter month and day names, handle the quirk that both 0 and 7 mean Sunday, and then match a timestamp - including the classic rule that when both day-of-month and day-of-week are restricted, either one matching is enough. Finally you compute the next fire time by scanning forward a minute at a time, correctly rolling across hour, day, and month boundaries, skipping months with no 31st, and landing on Feb 29 only in a leap year. Shortcut macros like `@daily` round it out.

  This is a teaching-grade scheduler built around the standard five-field cron grammar (minute, hour, day-of-month, month, day-of-week) at minute resolution. It is honest about what it stops short of: no seconds field, no time zones or daylight-saving handling (timestamps are treated as naive), and none of the later Vixie and Quartz extensions like `L`, `W`, or `#`. What you finish with is the exact core that libraries like Vixie cron, croniter, and Quartz build on - a parser that compiles a cron line to value sets, a matcher, and a next-fire scanner - demonstrated by a small command-line tool that prints an expression's next fire times.
parts:
  - name: 'The five fields'
    count: 3
  - name: 'Field syntax'
    count: 6
  - name: 'Named values'
    count: 3
  - name: 'Matching a time'
    count: 4
  - name: 'Next fire time'
    count: 4
  - name: 'Shortcuts and the capstone'
    count: 2
caveats:
  note: 'A genuinely working teaching-grade scheduler: the full standard five-field grammar (wildcards, single values, lists, ranges, and steps over both the wildcard and explicit ranges), three-letter month and day names, the quirk that both 0 and 7 mean Sunday, the day-of-month OR day-of-week matching rule, a timestamp matcher, a next-fire scanner that rolls correctly across day, month, and year boundaries and resolves leap-day expressions, next-N fire times, and the @hourly / @daily / @weekly / @monthly / @yearly macros (plus the @midnight and @annually aliases) - driven by a small asset-free command-line demo - but it stops at the standard core: no seconds field, no time zones or daylight-saving handling (timestamps are treated as naive), and none of the Vixie or Quartz L, W, or # extensions.'
  future:
    - 'Time-zone-aware scheduling with an explicit location, instead of treating every timestamp as naive local time'
    - 'An optional seconds field - the six-field cron form that some variants accept'
    - 'The L, W, and # day extensions (last day of the month, nearest weekday, the nth weekday) from Vixie and Quartz cron'
    - 'A faster next-fire search that rolls each field forward directly instead of scanning a minute at a time'
    - 'A real scheduler loop that sleeps until each fire time and runs a job, rather than only answering next-fire queries'
resources:
  - title: 'POSIX crontab specification (The Open Group Base Specifications)'
    url: 'https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html'
    note: 'The standard definition of the five-field cron grammar - minute, hour, day-of-month, month, day-of-week, their ranges, and the rule that a restricted day-of-month and day-of-week are combined with OR. The baseline every cron implementation starts from.'
  - title: 'crontab(5) manual page'
    url: 'https://man7.org/linux/man-pages/man5/crontab.5.html'
    note: 'The Vixie-cron field reference: lists, ranges, steps, three-letter month and day names, the fact that both 0 and 7 mean Sunday, and the @hourly / @daily / @weekly / @monthly / @yearly shortcut macros this project implements.'
  - title: 'crontab(5) - FreeBSD manual (Paul Vixie)'
    url: 'https://man.freebsd.org/cgi/man.cgi?crontab(5)'
    note: 'Paul Vixie''s own crontab documentation, the source of the step syntax (`*/n` and `a-b/n`) and the named macros. A precise, readable statement of the syntax you compile field by field.'
  - title: 'The cron day-of-week / day-of-month gotcha'
    url: 'https://crontab.guru/cron-bug.html'
    note: 'A focused explainer of the single most surprising rule in cron: when both the day-of-month and day-of-week fields are restricted, the schedule fires when EITHER matches, not both. The exact behavior lesson 16 pins down.'
  - title: 'crontab.guru - the cron schedule expression editor'
    url: 'https://crontab.guru/'
    note: 'An interactive reference that translates any cron expression into plain English and shows its upcoming fire times. Use it to sanity-check the value sets and next-fire timestamps you compute by hand.'
---
