---
project: build-a-load-balancer
lesson: 18
title: Passive ejection
overview: A backend that keeps failing must be pulled from rotation. Passive ejection watches the failure streak and marks a backend down after a fall threshold of consecutive failures - and not one failure sooner.
goal: Mark a backend down once its consecutive-failure streak reaches the fall threshold of 3.
spec:
  scenario: A backend is ejected after exactly three consecutive failures
  status: failing
  lines:
    - kw: Given
      text: 'an up backend A and a fall threshold of 3'
    - kw: When
      text: 'two consecutive failures are recorded'
    - kw: Then
      text: 'A is still up (a streak of 2 has not reached the threshold)'
    - kw: And
      text: 'recording a third consecutive failure marks A down (exactly 3, not 2); but if a success interrupts the streak - failure, failure, success, failure, failure - A stays up because the streak reset'
code:
  lang: go
  source: |
    const fallThreshold = 3
    // extend RecordFailure to eject at the threshold:
    func (b *Backend) RecordFailure() {
      b.failStreak++
      b.successStreak = 0
      if b.IsUp() && b.failStreak >= fallThreshold { b.MarkDown() }
    }
checkpoint: A backend is ejected after a run of failures, but a single success resets the count. Commit and stop here.
---

**Passive ejection** (in HAProxy and NGINX terms, `max_fails` before a backend is
taken out) is the first real state transition in the health machine: `Up` becomes
`Down` when the consecutive-failure streak reaches the **fall threshold**. Tying it
to a streak rather than a total is what makes it robust - an occasional failure
among many successes should not eject a healthy backend, but three failures in a row
strongly suggests the backend is actually broken.

Two edges define the behavior and both are pinned. First, the threshold is
**exactly** reached, not approached: at a streak of 2 the backend is still up, and
the third failure is the one that ejects it. Off-by-one here (ejecting at 2, or only
at 4) is the classic bug. Second, a success **resets** the streak, so an interrupted
run never accumulates to ejection. Because you built `RecordFailure` to zero the
success streak and `RecordSuccess` to zero the failure streak last chapter, the reset
falls out naturally - you only add the threshold check.
