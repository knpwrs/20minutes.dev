---
project: build-a-regex-engine
lesson: 21
title: Compiling the star
overview: The star becomes a Split that loops. One arrow enters the element and comes back; the other skips past. This is the same fork as alternation, wired into a cycle.
goal: Compile `x*` into a Split that either enters x (looping back) or skips ahead.
spec:
  scenario: Star compiles to a looping Split
  status: failing
  lines:
    - kw: Given
      text: 'the AST for "a*"'
    - kw: When
      text: it is compiled into an NFA
    - kw: Then
      text: "the start is a Split state whose first branch enters the Char 'a' state"
    - kw: And
      text: "the 'a' state's out arrow loops back to that same Split, and the Split's second branch is the fragment's dangling exit"
code:
  lang: go
  source: |
    // Split: one branch into a, one branch onward (the exit).
    s := &State{Kind: Split, Out: a.start}
    patch(a.out, s)           // a loops back to the Split
    return Frag{start: s, out: []**State{&s.Out1}} // Out1 is the exit
checkpoint: '`*` compiles to a Split that loops through its element or skips it. Commit and stop here.'
---

Zero-or-more is a loop. The `Split` for `a*` has one arrow that enters the `a` state
and one that bypasses it. Crucially, the `a` state's exit is patched **back to the
`Split`** - so after matching one `a`, the machine returns to the fork and can either
go around again or leave. The bypass arrow (`Out1`) stays dangling as the fragment's
single exit. That's the whole star: a fork where one prong is a cycle.

Because the machine can take the bypass immediately, `a*` correctly matches zero `a`s;
because the loop returns to the same `Split`, it matches any number. Notice there's no
backtracking here and no risk of exponential blowup - the loop is just an arrow in a
graph. That structural difference from chapter two's recursive star is exactly why the
NFA will stay fast. Tomorrow, `+` and `?` are the same `Split` with the loop arrow
placed differently.
