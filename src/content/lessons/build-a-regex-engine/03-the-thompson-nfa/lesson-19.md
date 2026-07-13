---
project: build-a-regex-engine
lesson: 19
title: Compiling concatenation
overview: Concatenation is where fragments connect. You patch the dangling exits of one fragment onto the start of the next, threading two states into a chain.
goal: Compile a concatenation by patching the first fragment's dangling exits into the second fragment's start.
spec:
  scenario: Concatenation chains two fragments in series
  status: failing
  lines:
    - kw: Given
      text: 'the AST for "ab"'
    - kw: When
      text: it is compiled into an NFA
    - kw: Then
      text: "the start is a Char state for 'a' whose out arrow points to a Char state for 'b'"
    - kw: And
      text: "the whole fragment's single dangling exit is the 'b' state's out arrow"
code:
  lang: go
  source: |
    // patch every dangling exit in `out` to point at state s
    func patch(out []**State, s *State) {
        for _, p := range out { *p = s }
    }
    // concat: patch a's exits onto b's start; keep b's exits dangling
    patch(a.out, b.start)
    return Frag{start: a.start, out: b.out}
checkpoint: Concatenation patches one fragment's exits onto the next, building a chain of states. Commit and stop here.
---

A concatenation like `ab` should run through the `a` state and then the `b` state. In
fragment terms, that means taking the `a` fragment's dangling exits and **patching**
them so they point at the `b` fragment's start. After the patch, the combined
fragment starts where `a` started, and its own dangling exits are whatever `b` left
open. This is the one operation Thompson construction repeats everywhere, so it's
worth writing a small `patch` helper for it.

The reason exits are stored as pointers-to-pointers (arrows you can rewrite) is
exactly this step: at compile time you often know a state exists before you know what
comes after it, so you leave its exit dangling and patch it once the successor is
built. Get concatenation right and alternation, star, plus, and quest are all just
different wiring of the same `Split` state - which you add next.
