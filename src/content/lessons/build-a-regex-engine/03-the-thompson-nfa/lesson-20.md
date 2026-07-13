---
project: build-a-regex-engine
lesson: 20
title: Compiling alternation
overview: Alternation introduces the Split state - a fork with two arrows that lets the machine be in two places at once. It is the heart of what makes an NFA "nondeterministic."
goal: Compile `a|b` into a Split state that branches to each alternative.
spec:
  scenario: Alternation compiles to a two-way Split
  status: failing
  lines:
    - kw: Given
      text: 'the AST for "a|b"'
    - kw: When
      text: it is compiled into an NFA
    - kw: Then
      text: "the start is a Split state whose two branches lead to a Char 'a' and a Char 'b'"
    - kw: And
      text: "the fragment's dangling exits are the exits of both the 'a' and 'b' states"
code:
  lang: go
  source: |
    // Split has TWO out arrows and matches no character - it just
    // forks. For a|b: one branch to a.start, one to b.start.
    s := &State{Kind: Split, Out: a.start, Out1: b.start}
    return Frag{start: s, out: append(a.out, b.out...)}
checkpoint: '`|` compiles to a Split that forks into both branches. Commit and stop here.'
---

The `Split` state is what makes this machine an **NFA** - a nondeterministic finite
automaton. Unlike a `Char` state, a `Split` matches no input; it simply forks into two
possible next states. For `a|b`, the fragment starts at a `Split` whose two arrows lead
into the `a` fragment and the `b` fragment. The combined fragment's dangling exits are
just both children's exits gathered together, since either branch can be the one that
eventually exits.

"Nondeterministic" sounds exotic but the idea is simple: at a `Split`, the machine
conceptually follows *both* arrows at once. Tomorrow's star reuses the same `Split`
with one arrow looping back, and in a few lessons you'll see how the simulator handles
these forks - by tracking a whole *set* of states the machine could currently be in,
rather than committing to one path and backtracking like chapter two did.
