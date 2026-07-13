---
project: build-git
lesson: 21
title: 'The identity line'
overview: 'A commit records who made it and when, in a precise one-line format. Because the timestamp is part of that line and therefore part of the commit hash, we fix it to a known value so our commit ids are reproducible.'
goal: 'Format an identity line, and parse one back into its name, email, timestamp, and timezone.'
spec:
  scenario: An identity line round-trips
  status: failing
  lines:
    - kw: Given
      text: 'the name Ada Lovelace, the email ada@example.com, the Unix time 1700000000, and the timezone +0000'
    - kw: When
      text: 'IdentityLine builds the line'
    - kw: Then
      text: 'it is Ada Lovelace <ada@example.com> 1700000000 +0000 (email in angle brackets, then the epoch seconds, a space, and the timezone offset)'
    - kw: And
      text: 'parsing that same line back with ParseIdentity recovers the name Ada Lovelace, the email ada@example.com, the timestamp 1700000000, and the timezone +0000'
code:
  lang: go
  source: |
    // "<name> <email> <unix-seconds> <tz>"
    func IdentityLine(name, email string, unix int64, tz string) string {
      return fmt.Sprintf("%s <%s> %d %s", name, email, unix, tz)
    }
    // ParseIdentity reverses it: split on " <" and "> ", then the last
    // two space-separated fields are the epoch seconds and the timezone.
checkpoint: 'You can format an identity line and read one back. Commit and stop here.'
---

A commit carries two identities: the **author** (who wrote the change) and the
**committer** (who created the commit object). Most of the time they are the same.
Each is written as one line: the name, the email in angle brackets, then the
timestamp as **seconds since the Unix epoch** and a timezone offset like `+0000`.

The timestamp is why commit ids are usually unpredictable: commit the same tree a
second later and you get a different hash. That would make this project untestable,
so we pin a **fixed identity and time** (`Ada Lovelace`, `1700000000`, `+0000`)
throughout. With those fixed, a commit's id is fully reproducible, and it matches
what real Git produces when you set the same `GIT_AUTHOR_DATE` and
`GIT_COMMITTER_DATE`. That reproducibility is what lets us pin exact commit ids in
the lessons ahead.

Build the parse direction too, as the mirror of the format. Reading a commit back
later means pulling the name, email, time, and zone out of exactly this line, so a
small `ParseIdentity` now saves work when we parse whole commit objects. Together
the two are one idea seen both ways: the precise shape of an identity, written and
read.
