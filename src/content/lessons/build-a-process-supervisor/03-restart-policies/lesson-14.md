---
project: build-a-process-supervisor
lesson: 14
title: unless-stopped and the manual-stop flag
overview: The last policy is like always, except a service a human deliberately stopped stays down. To tell the difference the supervisor must remember whether the exit followed a manual stop. Today you add that flag and use it to separate unless-stopped from always.
goal: Record whether a service was manually stopped, and decide unless-stopped versus always on that flag.
spec:
  scenario: A manual stop is respected by unless-stopped but not by always
  status: failing
  lines:
    - kw: Given
      text: 'ShouldRestart now also takes manuallyStopped, and Stop sets a service''s ManuallyStopped flag to true'
    - kw: When
      text: 'a service exits after a manual stop (manuallyStopped true, code 0)'
    - kw: Then
      text: 'ShouldRestart(PolicyUnlessStopped, 0, true) is false, but ShouldRestart(PolicyUnlessStopped, 1, false) is true (it restarts a crash it was not asked to stop)'
    - kw: And
      text: 'ShouldRestart(PolicyAlways, 0, true) is true - always ignores a manual stop and brings it back anyway'
code:
  lang: go
  source: |
    // Stop() now sets svc.ManuallyStopped = true before signalling.
    // ShouldRestart(p, code, manuallyStopped):
    case PolicyUnlessStopped:
      return !manuallyStopped   // like always, but a manual stop wins
    case PolicyAlways:
      return true               // even a manual stop is restarted
    // never / on-failure ignore the flag (a manual stop already means no crash)
checkpoint: unless-stopped respects a manual stop while always ignores it. Commit and stop here.
---

`unless-stopped` behaves like `always` - restart on any exit - with one humane
exception: if an operator **deliberately stopped** the service, leave it down. That
is what you want across a reboot or a daemon restart: services you had running come
back, but the one you intentionally took offline stays offline. To honor it, the
supervisor has to remember a single fact about each service - was its most recent
stop a manual one? So `Stop` now sets a `ManuallyStopped` flag.

That flag is what finally separates all four policies into distinct behaviors.
`never` never restarts; `on-failure` splits on the exit code; and now `always` and
`unless-stopped` split on the manual-stop flag - `always` brings a service back even
after you stopped it, while `unless-stopped` respects your decision. With the flag
in hand, `ShouldRestart` is a complete, three-input decision. The next lesson finally
*acts* on it.
