---
project: build-git
lesson: 31
title: 'The second commit advances history'
overview: 'With commit wired into HEAD, a second commit just works: it picks up the first as its parent and moves the branch forward. Today you make that second commit and watch history grow by one link.'
goal: 'Make a second commit that links to the first and advances the branch.'
spec:
  scenario: A second commit chains onto the first
  status: failing
  lines:
    - kw: Given
      text: 'the repository after the first commit (refs/heads/main at f18e98d326b190d096879422d56d4ac5cf572db1), with hello.txt changed to hello world and a newline, re-staged, at time 1700000060 and message Update greeting'
    - kw: When
      text: 'Commit(index, message) is called again'
    - kw: Then
      text: 'its parent is f18e98d326b190d096879422d56d4ac5cf572db1 and its id is 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6'
    - kw: And
      text: 'refs/heads/main now holds 9bae7f0a71d91d794187cf9de39901bfbfbfc7b6'
code:
  lang: go
  source: |
    // no new code should be needed: the parent-from-HEAD and branch-move
    // logic from the last lesson does exactly this
    r.Add(ix, "hello.txt")          // hello.txt -> 3b18e512...
    id, _ := r.Commit(ix, ident, "Update greeting\n")
    // id == "9bae7f0a71d91d794187cf9de39901bfbfbfc7b6"; main advanced
checkpoint: 'History grows by a linked commit. Commit and stop here. This is the payoff of wiring commit into HEAD.'
---

This lesson should need almost no new code, and that is the point. Because the
commit porcelain already takes its parent from HEAD and advances the branch, a
second commit falls out for free: staging the changed `hello.txt` gives a new blob
and a new root tree, and committing picks up `f18e98d3...` as the parent, producing
`9bae7f0a...` and moving `main` to it. If your machinery is right, you write a test
and it passes.

That is a satisfying "it just works" moment worth pausing on: you now have a real,
growing history, a chain of commits each pointing at its predecessor, each an
immutable content-addressed snapshot, with a branch label tracking the tip. The
only thing left to make this feel like Git is to walk that chain, which is exactly
what `log` does next.
