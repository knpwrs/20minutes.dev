---
project: build-a-process-supervisor
lesson: 19
title: Counting restarts in a window
overview: To catch a crash loop the supervisor needs to know not just how many times a service restarted, but how many times recently. Today you record the timestamp of every restart and count how many fall inside a trailing time window.
goal: Record each restart's time and count how many happened within the last window T.
spec:
  scenario: Only restarts inside the window are counted
  status: failing
  lines:
    - kw: Given
      text: 'a window T of 60s and a service whose restarts were performed at times 5s, 20s, and 50s'
    - kw: When
      text: 'RecentRestarts() is evaluated at t=55s'
    - kw: Then
      text: 'all three restarts are within the last 60s (since 55-60 = -5s), so the count is 3'
    - kw: And
      text: 'at t=70s the restart at 5s has aged out (70-60 = 10s > 5s), so only the 20s and 50s restarts count - RecentRestarts() is 2'
code:
  lang: go
  source: |
    // append s.clock.Now() to svc.Restarts each time Tick performs a restart
    func (s *Supervisor) RecentRestarts(svc *Service) int {
      cutoff := s.clock.Now() - 60*time.Second
      n := 0
      for _, t := range svc.Restarts { if t >= cutoff { n++ } }
      return n
    }
checkpoint: The supervisor counts how many restarts fell inside the trailing window. Commit and stop here.
---

A total restart count cannot distinguish a service that crashed three times over a
week from one that crashed three times in five seconds - but only the second is a
**crash loop**. What matters is the *rate*: how many restarts happened **recently**.
So the supervisor keeps a timestamp for each restart and, to judge health, counts
only those inside a trailing **window** - here the last 60 seconds. This is exactly
supervisord's `startretries` measured over a period, and OTP's "maximum restart
intensity within a period."

The subtlety is the window edge. A restart is "recent" only if its timestamp is at
or after `Now() - T`; older ones have aged out and no longer count against the
service. Pin both sides: an old restart that is still just inside the window counts,
and the same restart one tick later, once it falls outside, does not. Getting that
cutoff exact is what makes the give-up rule in the next lesson trigger at the right
moment instead of one crash early or late.
