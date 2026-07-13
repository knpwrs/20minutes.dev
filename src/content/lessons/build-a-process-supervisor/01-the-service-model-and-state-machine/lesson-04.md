---
project: build-a-process-supervisor
lesson: 4
title: Legal state transitions
overview: A service cannot jump anywhere. It can only follow the edges of its lifecycle - Stopped to Starting, Starting to Running, and so on. Today you encode which moves are legal so that every later action is checked against the machine instead of trusted blindly.
goal: Define which state transitions are legal and reject the ones that are not.
spec:
  scenario: Only lifecycle edges are permitted
  status: failing
  lines:
    - kw: Given
      text: 'the transition rules of the lifecycle'
    - kw: When
      text: 'CanTransition(from, to) is asked'
    - kw: Then
      text: 'Stopped to Starting is true, Starting to Running is true, Running to Stopping is true, Running to Exited is true, Stopping to Stopped is true, and Exited to Starting is true'
    - kw: And
      text: 'illegal jumps are false: Running to Starting is false, Stopped to Running is false, and Failed to Starting is false (Failed is terminal)'
code:
  lang: go
  source: |
    // adjacency of the lifecycle graph; list each legal (from -> to) edge
    var legal = map[State][]State{
      Stopped:  {Starting},
      Starting: {Running, Exited},
      Running:  {Stopping, Exited},
      Stopping: {Stopped, Exited},
      Exited:   {Starting, Stopped, Failed},
      // Failed has no outgoing edges: it is terminal
    }
    func CanTransition(from, to State) bool { /* is to in legal[from]? */ }
checkpoint: The lifecycle's legal transitions are encoded and illegal jumps are rejected. Commit and stop here.
---

The value of a state machine is that it makes illegal moves impossible. A service
that is `Running` must pass through `Stopping` before it is `Stopped`; it can never
teleport from `Stopped` straight to `Running` without a `Starting` phase where the
process is actually spawned. Encoding the legal **edges** once, up front, means
every later operation can ask "is this move allowed?" instead of silently corrupting
state.

Pay attention to the terminal state: `Failed` has no outgoing edges. Once the
supervisor gives up on a service after a crash loop, nothing moves it automatically -
a human has to intervene. That single rule is what stops a hopeless service from
thrashing forever, and pinning `Failed to Starting is false` now is what makes the
crash-loop protection you build later actually final.
