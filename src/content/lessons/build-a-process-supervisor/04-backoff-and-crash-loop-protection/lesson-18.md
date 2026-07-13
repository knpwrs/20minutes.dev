---
project: build-a-process-supervisor
lesson: 18
title: Deferring the restart on the clock
overview: Now the restart obeys the backoff. Instead of respawning the instant a service crashes, the supervisor schedules the restart for a future time and holds the service in Exited until the clock reaches it. Today a crashed service waits its backoff before coming back.
goal: On a crash, schedule the restart at now plus its backoff, and only perform it when the clock reaches that time.
spec:
  scenario: A restart waits for its backoff to elapse
  status: failing
  lines:
    - kw: Given
      text: 'at t=0 a Running on-failure "worker" is reaped with code 1 (its first restart, so backoff is 1s)'
    - kw: Then
      text: 'the service stays Exited with RestartAt == 1s, and calling Tick() at t=0 does not restart it (still Exited)'
    - kw: And
      text: 'after Advance to t=1s, Tick() performs the due restart - the service is Starting, RestartCount 1, and a new process was spawned exactly once'
code:
  lang: go
  source: |
    // Reap: on a restart-worthy crash, schedule instead of respawning now:
    svc.RestartAt = s.clock.Now() + Backoff(svc.RestartCount+1)
    svc.State = Exited // waits here until due
    // Tick performs any restarts whose time has come:
    func (s *Supervisor) Tick() {
      for _, name := range s.Names() {
        svc, _ := s.Get(name)
        if svc.State == Exited && svc.RestartAt >= 0 && s.clock.Now() >= svc.RestartAt {
          svc.RestartCount++; svc.Handle = s.rt.Start(svc.Command)
          svc.State = Starting; svc.RestartAt = -1
        }
      }
    }
checkpoint: A crashed service waits its backoff and is restarted by Tick when the time arrives. Commit and stop here.
---

Backoff only matters if the supervisor actually waits. So the restart splits into
two moments: when a service crashes, the supervisor computes *when* it should come
back - `Now()` plus this attempt's `Backoff` - and records that as `RestartAt`,
leaving the service parked in `Exited`. Nothing respawns yet. Then a periodic
**`Tick`** sweeps the services and starts any whose scheduled time has arrived. This
is the same pattern a real supervisor's event loop uses: compute a deadline, and act
when the clock passes it.

This is a deliberate change to how restarts worked a few lessons ago - they used to
fire immediately inside `Reap`. Now `Reap` only *schedules*, and `Tick` *performs*.
Pin both halves of the boundary: at `t=0` the restart is due at `1s`, so `Tick` does
nothing; advance the clock to exactly `1s` and `Tick` brings the service back. That
gap is where crash-loop protection lives, because a service that keeps landing back
in `Exited` gives you a natural place to count how often it has done so - which is
the next lesson.
