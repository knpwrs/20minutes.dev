---
project: build-a-regex-engine
lesson: 24
title: Simulating the machine
overview: This is the payoff of the chapter - feeding input through the NFA by tracking a whole set of active states at once. One pass, no backtracking, a yes-or-no answer.
goal: Step a set of NFA states across the input one character at a time, accepting if a Match state is active at the end.
spec:
  scenario: The simulation matches by advancing a set of states
  status: failing
  lines:
    - kw: Given
      text: 'the compiled NFA for "a|b"'
    - kw: When
      text: 'nfaMatch runs it against "b"'
    - kw: Then
      text: 'it reports true, and nfaMatch for "a|b" against "c" reports false'
    - kw: And
      text: 'nfaMatch for "ab*" against "abbb" reports true, and against "abx" reports false'
    - kw: And
      text: nfaMatch requires the whole input to be consumed and a Match state reached
code:
  lang: go
  source: |
    // clist = closure of the start state (via addState)
    // for each byte ch in text:
    //   nlist = {}
    //   for each Char state s in clist where s.Ch == ch:
    //       addState(&nlist, s.Out)   // step across, then close
    //   clist = nlist
    // accept if any Accept state is in clist
checkpoint: nfaMatch runs input through the NFA in a single pass, tracking all active states. Commit and stop here.
---

Here is the idea that makes an NFA fast: instead of committing to one path and
backtracking when it fails, the simulator keeps the **set of all states the machine
could be in right now**. Start with the epsilon-closure of the start state. For each
input byte, look at every `Char` state in the current set, keep the ones whose byte
matches, step across their out arrows, and take the closure of where you land. That
becomes the set for the next byte. If a `Match` state is in the set once the input is
exhausted, the pattern matched.

Because each state appears in the set at most once per step, the work is bounded by
the number of states times the length of the input - **linear**, no matter how many
`Split` forks the pattern has. That's the whole difference from chapter two. Note this
`nfaMatch` is a *whole-string* match: it succeeds only if the entire input is consumed
reaching a `Match` state, so the anchors `^` and `$` are effectively built in. Tomorrow
you teach the machine `.`, classes, and how to treat those anchors.
