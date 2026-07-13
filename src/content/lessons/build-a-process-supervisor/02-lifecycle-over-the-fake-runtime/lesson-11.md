---
project: build-a-process-supervisor
lesson: 11
title: Reaping a crash and classifying the exit
overview: A Running service that exits on its own has crashed or finished, and the supervisor must record why. Exit code 0 is a clean exit; anything nonzero is a failure. Today you reap that unexpected exit into Exited and remember the code, because every restart decision hangs on it.
goal: Reap a Running service to Exited, recording its exit code and whether it was clean.
spec:
  scenario: An unexpected exit is classified by its code
  status: failing
  lines:
    - kw: Given
      text: 'a Running service "worker"'
    - kw: When
      text: 'Reap("worker", 0) is called'
    - kw: Then
      text: 'State becomes Exited, LastExitCode is 0, and ExitedClean() is true (a clean exit)'
    - kw: And
      text: 'if instead a Running "worker" is reaped with Reap("worker", 2), State is Exited, LastExitCode is 2, and ExitedClean() is false (a failure)'
code:
  lang: go
  source: |
    // extend Reap to handle a Running service exiting unexpectedly
    case Running:
      svc.LastExitCode = code
      svc.State = Exited
    // and a helper the restart policy will read:
    func (svc *Service) ExitedClean() bool { return svc.LastExitCode == 0 }
checkpoint: An unexpected exit is reaped to Exited and classified clean or failed by its code. Commit and stop here.
---

There is a world of difference between a process that finished its work and exited
`0`, and one that crashed with a nonzero code. By universal Unix convention, **exit
code 0 means success** and **anything nonzero means failure** - a panic, an
uncaught exception, an assertion, a fatal error. A supervisor treats these
oppositely: a clean exit might be fine to leave alone, while a crash is exactly what
"keep it alive" is meant to catch.

So when a `Running` service is reaped, the supervisor moves it to `Exited` (distinct
from the `Stopped` of a service we deliberately stopped) and records its
`LastExitCode`. The `ExitedClean()` helper - true only when the code is zero - is the
single fact every restart policy consults next: `on-failure` restarts only when this
is false, while `always` ignores it entirely. Getting the classification exactly
right here, at the boundary between 0 and nonzero, is what makes all four policies
behave correctly.
