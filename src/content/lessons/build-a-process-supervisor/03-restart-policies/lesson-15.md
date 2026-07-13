---
project: build-a-process-supervisor
lesson: 15
title: Acting on the restart decision
overview: The policies decided; now the supervisor obeys. When a service is reaped, it consults the policy and, if a restart is warranted, spawns the service afresh and counts the attempt. Today the pieces connect - a crashed on-failure service comes back to life.
goal: On reap, consult the policy and restart the service if warranted, counting the restart.
spec:
  scenario: A crash under on-failure restarts; under never it does not
  status: failing
  lines:
    - kw: Given
      text: 'a Running on-failure service "worker" (RestartCount 0)'
    - kw: When
      text: 'Reap("worker", 1) is called'
    - kw: Then
      text: 'the policy says restart, so the service is spawned again (a new handle from the runtime), its State is Starting, and RestartCount is 1'
    - kw: And
      text: 'a Running never service reaped with code 1 stays Exited with RestartCount 0 - no new process is started'
code:
  lang: go
  source: |
    // after classifying a Running exit into Exited inside Reap:
    if ShouldRestart(svc.Policy, code, svc.ManuallyStopped) {
      svc.RestartCount++
      svc.Handle = s.rt.Start(svc.Command) // Exited -> Starting
      svc.State = Starting
    }
checkpoint: A crashed service restarts under its policy while a never service stays Exited. Commit and stop here.
---

This is the moment every policy lesson was building toward: the supervisor stops
merely *deciding* and starts *doing*. When a `Running` service is reaped, it lands
in `Exited` as before, and then the supervisor immediately asks `ShouldRestart`. If
the answer is yes, it spawns the command again through the runtime - a brand-new
handle, back to `Starting` - and increments a `RestartCount` so it can tell how many
times this service has come back.

That restart count is not bookkeeping for its own sake: it is the seed of crash-loop
protection. A service that keeps crashing will keep restarting here, forever, with
no pause between attempts - a tight, punishing loop. Right now the restart is
**immediate**, which is fine for one comeback but dangerous for a persistent crash.
The next chapter fixes both problems: it spaces restarts out with exponential
backoff, and it gives up entirely once a service has restarted too many times too
fast.
