---
project: build-a-process-supervisor
lesson: 20
title: Giving up - the crash-loop limit
overview: A service that will not stay up should not be restarted forever. Once it has restarted too many times inside the window, the supervisor gives up and moves it to the terminal Failed state. Today you pin the exact point where it stops trying.
goal: After the allowed number of restarts within the window, move the service to Failed instead of restarting again.
spec:
  scenario: The supervisor gives up after exactly three restarts in the window
  status: failing
  lines:
    - kw: Given
      text: 'a max of 3 restarts within a 60s window, and an on-failure "flaky" that has already restarted 3 times (at 1s, 3s, 7s) and is Running again'
    - kw: When
      text: 'it crashes once more with code 1 (a 4th restart would be needed, all within the window)'
    - kw: Then
      text: 'the supervisor does not schedule a 4th restart - the service moves to Failed and stays there (RestartCount remains 3)'
    - kw: And
      text: 'a crash that would be only the 3rd restart in the window is still allowed - the give-up happens after exactly 3, not 2'
code:
  lang: go
  source: |
    // in Reap, before scheduling a restart on a crash:
    if ShouldRestart(svc.Policy, code, svc.ManuallyStopped) {
      if s.RecentRestarts(svc) >= 3 { // already used up the budget
        svc.State = Failed            // give up; terminal
        return
      }
      svc.RestartAt = s.clock.Now() + Backoff(svc.RestartCount+1)
      svc.State = Exited
    }
checkpoint: A service that crashes too fast too often is moved to Failed and left alone. Commit and stop here.
---

Backoff slows a crash loop down, but on its own it never *ends* one - a service that
is permanently broken would still be retried every eight seconds forever. The final
guard is a **give-up rule**: if a service has already been restarted the maximum
number of times inside the window, the supervisor stops trying and moves it to the
terminal `Failed` state you reserved back in lesson 4. From there nothing restarts
it automatically; an operator has to look.

The exact trigger point is what to pin, and it is an easy off-by-one. The budget is
`3` restarts in `60s`: three comebacks are allowed, and it is the *fourth* one -
which would exceed the budget - that trips the give-up. So a crash needing only the
third restart still restarts, while the one needing a fourth fails the service. "Give
up after exactly N, not N-1" is the boundary. This closes crash-loop protection:
backoff paces the retries, the window counts them, and this rule ends them.
