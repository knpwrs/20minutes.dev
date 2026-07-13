---
project: build-a-process-supervisor
lesson: 2
title: The six states and their names
overview: A service is always in exactly one of six states, and the whole supervisor is really a machine that moves services between them. Today you name all six and give each a readable label, so every later spec can assert a state by a value you can print and compare.
goal: Define the six lifecycle states and a String label for each.
spec:
  scenario: Every state has a stable name
  status: failing
  lines:
    - kw: Given
      text: 'the six states Stopped, Starting, Running, Stopping, Exited, Failed'
    - kw: When
      text: 'String is called on each'
    - kw: Then
      text: 'they read "stopped", "starting", "running", "stopping", "exited", "failed" respectively'
    - kw: And
      text: 'the fresh service from lesson 1 has State.String() == "stopped"'
code:
  lang: go
  source: |
    type State int
    const (
      Stopped State = iota
      Starting
      Running
      Stopping
      Exited
      Failed
    )
    // fill in the label for each; String() drives every assertion later
    func (s State) String() string { /* map each constant to its name */ }
checkpoint: All six lifecycle states exist and print stable names. Commit and stop here.
---

The lifecycle of a supervised service is small but exact. **Stopped** means not
running and not wanted right now. **Starting** means the process has been spawned
but has not yet reported ready. **Running** is the healthy steady state.
**Stopping** means we asked it to shut down and are waiting for it to exit.
**Exited** means it ended on its own. **Failed** is the terminal give-up state the
supervisor moves a service to when restarting it is hopeless.

Giving each state a printable name is not cosmetic: every spec from here on asserts
state by comparing these labels, and the final status report prints them. Because a
supervisor is fundamentally a **state machine**, naming its states precisely is the
groundwork for the transition rules you pin down next.
