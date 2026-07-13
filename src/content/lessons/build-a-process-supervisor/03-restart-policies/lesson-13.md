---
project: build-a-process-supervisor
lesson: 13
title: The on-failure policy
overview: The most useful policy restarts a service only when it crashed - a nonzero exit - and leaves it alone when it finished cleanly. Today you decide the on-failure case, the one place the exit code changes the answer.
goal: Decide on-failure - restart on a nonzero exit, but not on a clean exit 0.
spec:
  scenario: on-failure restarts only a crash
  status: failing
  lines:
    - kw: Given
      text: 'the on-failure policy'
    - kw: When
      text: 'ShouldRestart(PolicyOnFailure, code) is asked for each code'
    - kw: Then
      text: 'ShouldRestart(PolicyOnFailure, 0) is false (a clean exit is left alone)'
    - kw: And
      text: 'ShouldRestart(PolicyOnFailure, 1) is true and ShouldRestart(PolicyOnFailure, 2) is true (any nonzero exit is a crash worth restarting)'
code:
  lang: go
  source: |
    // add the on-failure arm to ShouldRestart:
    case PolicyOnFailure:
      return code != 0 // restart a crash, leave a clean exit alone
checkpoint: on-failure restarts a crashed service but not a cleanly finished one. Commit and stop here.
---

`on-failure` is the policy that matches how most people actually think about "keep
it alive": if the service **crashed**, bring it back; if it **finished its work and
exited cleanly**, let it rest. The whole decision rides on the exit-code
classification you pinned in lesson 11 - `code != 0` is a crash, `code == 0` is a
clean finish - so this is the first policy where the number genuinely changes the
answer.

This is exactly the edge worth testing at the boundary. A policy that restarted on
*any* exit would be `always`; a policy that never restarted would be `never`. What
makes `on-failure` distinct is precisely that it splits at zero: `ShouldRestart(...,
0)` is `false` while `ShouldRestart(..., 1)` is `true`. Pin both sides of that
split, because a supervisor that restarts a job which already succeeded will loop it
forever, and one that ignores a crash defeats its own purpose.
