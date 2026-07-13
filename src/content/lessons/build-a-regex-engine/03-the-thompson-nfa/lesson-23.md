---
project: build-a-regex-engine
lesson: 23
title: Following the splits
overview: Before the machine can step on a character, it has to know every state it could currently be in - which means following all the Split forks. That set-gathering is today's whole job.
goal: Write addState, which follows Split states to collect the reachable Char and Match states into a set.
spec:
  scenario: Following splits collects the reachable consuming states
  status: failing
  lines:
    - kw: Given
      text: 'the compiled NFA for "a|b"'
    - kw: When
      text: the start state is expanded with addState
    - kw: Then
      text: "the resulting set contains the Char 'a' state and the Char 'b' state"
    - kw: And
      text: the set does not contain the Split state itself, since a Split consumes no input
code:
  lang: go
  source: |
    func addState(list *[]*State, s *State) {
        if s == nil { return }
        if s.Kind == Split {
            addState(list, s.Out)   // follow BOTH arrows
            addState(list, s.Out1)
            return
        }
        *list = append(*list, s)    // Char or Match: a real stop
    }
checkpoint: addState follows all Split forks to collect the states the machine can currently be in. Commit and stop here.
---

A `Split` consumes no input, so the machine passes straight through it - possibly
through several in a row. Before you can match the next character, you need the full
set of **consuming** states (the `Char` and `Match` states) reachable from where you
are by following `Split` arrows only. That's `addState`: given a state, if it's a
`Split`, recurse into both of its arrows; otherwise add it to the set. This is the
NFA's **epsilon-closure** - the states reachable without eating a character.

For the `a|b` NFA, expanding the start `Split` yields exactly the `a` and `b` `Char`
states, and not the `Split` itself. One practical caution: loops built by star and
plus mean a naive recursion could revisit a `Split` forever. The standard guard is to
stamp each state with the current step number as you add it, and skip any state already
stamped this step. With the closure in hand, tomorrow's simulator is a short loop.
