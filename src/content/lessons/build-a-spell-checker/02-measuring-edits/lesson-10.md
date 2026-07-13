---
project: build-a-spell-checker
lesson: 10
title: Distance within a limit
overview: A checker only cares about words a typo or two away, never how far apart two unrelated words are. Today you build a bounded check that answers "is the distance at most k?" and bails out early when it cannot possibly be, which is what makes searching a big dictionary affordable.
goal: Answer whether two words are within a maximum edit distance, short-circuiting when the answer must be no.
spec:
  scenario: Testing distance against a ceiling
  status: failing
  lines:
    - kw: Given
      text: the distance function
    - kw: When
      text: 'Within(a, b, max) is asked whether the distance is at most max'
    - kw: Then
      text: 'Within("cat", "cot", 1) is true and Within("cat", "dog", 1) is false'
    - kw: And
      text: 'Within("cat", "elephant", 2) is false and returns immediately, because the lengths differ by more than 2'
code:
  lang: go
  source: |
    func Within(a, b string, max int) bool {
      // fast reject: if abs(len(a)-len(b)) > max, the answer is
      // already no - two strings that differ in length by L need at
      // least L edits, so return false without touching the table
      // otherwise fall back to Distance(a,b) <= max
    }
checkpoint: You can ask "within k edits?" and reject hopeless pairs instantly. Commit and stop here.
---

When you search a dictionary for corrections, you are never interested in the exact
distance to `elephant` - you only want the handful of words within one or two edits
of the typo. Computing a full edit-distance table against every word to then throw
away every large result is wasted work, so the useful primitive is a **bounded**
question: is the distance at most `max`?

The first and cheapest win is the **length bound**. Turning one word into another
that is `L` letters longer needs at least `L` insertions, so if the lengths differ
by more than `max`, the distance *must* exceed `max` - answer `false` without
computing anything. `cat` and `elephant` differ by five letters, so no amount of
editing brings them within two, and `Within` says so instantly. That early exit is
the seed of every fast lookup later in the project; the next chapters build indexes
that prune far more aggressively, all resting on the same idea that distance has
lower bounds you can check cheaply.
