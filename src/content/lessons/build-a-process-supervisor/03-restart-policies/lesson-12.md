---
project: build-a-process-supervisor
lesson: 12
title: The restart policy - never and always
overview: What should happen when a service exits depends on its restart policy. Today you introduce all four policy names and decide the two extremes, where never restarts nothing and always restarts on any exit. This is the decision function every later policy lesson extends.
goal: Give each service a restart policy and decide the never and always cases for both exit codes.
spec:
  scenario: The extreme policies ignore the exit code
  status: failing
  lines:
    - kw: Given
      text: 'the four policies PolicyNever, PolicyOnFailure, PolicyAlways, PolicyUnlessStopped and a decision ShouldRestart(policy, code)'
    - kw: When
      text: 'the extreme policies are asked'
    - kw: Then
      text: 'ShouldRestart(PolicyNever, 0) and ShouldRestart(PolicyNever, 1) are both false'
    - kw: And
      text: 'ShouldRestart(PolicyAlways, 0) and ShouldRestart(PolicyAlways, 1) are both true (always restarts even after a clean exit)'
code:
  lang: go
  source: |
    type RestartPolicy int
    const (
      PolicyNever RestartPolicy = iota
      PolicyOnFailure
      PolicyAlways
      PolicyUnlessStopped
    )
    // Service gains a Policy field; decide the two extremes today
    func ShouldRestart(p RestartPolicy, code int) bool {
      switch p {
      case PolicyNever:  return false
      case PolicyAlways: return true
      }
      return false // on-failure / unless-stopped: next lessons
    }
checkpoint: The never and always restart policies decide correctly for any exit code. Commit and stop here.
---

Whether a supervisor brings a dead service back is not one rule but a **policy** the
operator chooses per service, exactly as systemd's `Restart=` and supervisord's
`autorestart` do. There are four worth modelling. The two extremes are the easiest
to reason about: `never` means the supervisor never brings the service back once it
exits, and `always` means it restarts on *every* exit, clean or crashed - the right
choice for a daemon that should be running whenever the machine is up.

Introduce all four policy names now, even though today you only decide two, so that
`ShouldRestart` is the single home every service's exit decision flows through. The
middle two policies - `on-failure` and `unless-stopped` - are the interesting ones,
because they depend on *why* the service exited: its exit code, and whether a human
asked it to stop. You add those next, one distinguishing case at a time.
