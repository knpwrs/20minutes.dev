---
project: build-a-regex-engine
lesson: 22
title: Compiling plus and quest
overview: '`+` and `?` are the star''s siblings - the same Split, just placed differently. Plus loops after the element; quest forks before it with no loop.'
goal: Compile `x+` and `x?` using a Split placed after the element (plus) or before it (quest).
spec:
  scenario: Plus and quest compile to a single Split
  status: failing
  lines:
    - kw: Given
      text: 'the AST for "a+"'
    - kw: When
      text: it is compiled into an NFA
    - kw: Then
      text: "the start is the Char 'a' state, whose out leads to a Split that loops back to 'a' or exits"
    - kw: And
      text: 'for "a?", the start is a Split that either enters the Char state or skips straight to the exit, with no loop'
code:
  lang: go
  source: |
    // plus: enter a first, THEN a Split that loops or exits
    s := &State{Kind: Split, Out: a.start}
    patch(a.out, s)
    return Frag{start: a.start, out: []**State{&s.Out1}}
    // quest: a Split before a; both a's exit and the skip arrow dangle
checkpoint: '`+` and `?` compile to a single Split, completing the quantifiers in the NFA. Commit and stop here.'
---

Once star clicks, `+` and `?` are small variations on where the `Split` sits. For
`a+` (one or more), the machine must run through `a` **first**, so the fragment starts
at the `a` state; its exit leads into a `Split` that either loops back to `a` or moves
on. That guarantees at least one match before the loop is even reachable. For `a?`
(zero or one), a `Split` sits **before** `a` with no loop at all: one branch enters
`a`, the other skips it, and both paths lead to the exit.

Seeing all three quantifiers as placements of one `Split` is the satisfying payoff of
Thompson construction - a tiny, uniform toolkit builds every repetition. Your NFA
compiler can now handle the same core syntax the backtracker did. What it can't do yet
is actually *run*: you have graphs but no way to feed input through them. The next two
lessons build that simulator, starting with the trick that tames all these `Split` forks.
