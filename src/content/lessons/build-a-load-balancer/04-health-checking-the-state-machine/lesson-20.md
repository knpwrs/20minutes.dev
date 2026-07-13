---
project: build-a-load-balancer
lesson: 20
title: Recovery
overview: A recovered backend should rejoin the pool - but cautiously. Recovery marks a down backend up again only after a rise threshold of consecutive successful probes, so one lucky probe does not put a flapping backend back into rotation.
goal: Bring a down backend back up once its consecutive-success streak reaches the rise threshold of 2.
spec:
  scenario: A down backend recovers after exactly two consecutive successes
  status: failing
  lines:
    - kw: Given
      text: 'a down backend A and a rise threshold of 2'
    - kw: When
      text: 'one successful probe is recorded'
    - kw: Then
      text: 'A is still down (a streak of 1 has not reached the threshold)'
    - kw: And
      text: 'a second consecutive success marks A up (exactly 2); but if a failure interrupts - success, failure, success - A stays down because the success streak reset'
code:
  lang: go
  source: |
    const riseThreshold = 2
    // extend RecordSuccess to recover a down backend at the threshold:
    func (b *Backend) RecordSuccess() {
      b.successStreak++
      b.failStreak = 0
      if !b.IsUp() && b.successStreak >= riseThreshold { b.MarkUp() }
    }
checkpoint: A down backend rejoins the pool after a run of successful probes. Commit and stop here.
---

**Recovery** is the mirror image of ejection, and it completes the health state
machine: `Down` returns to `Up` when the consecutive-success streak reaches the
**rise threshold**. Requiring a run of successes rather than a single one is what
tames **flapping** - a backend that recovers for one probe and fails the next should
not bounce in and out of rotation, dragging requests toward a server that is not
really well. A modest rise threshold makes the balancer patient about readmission.

The two thresholds together give the classic hysteresis of a health checker: it
takes `fall` failures to eject and `rise` successes to readmit, and because failure
and success streaks reset each other, only an unbroken run in one direction moves the
state. Pin the same two edges as ejection - the transition happens at exactly the
threshold, and an interrupting failure resets the streak so recovery has to start
over. With this, a down backend that the active prober finds healthy will climb back
into `Available()` on its own.
