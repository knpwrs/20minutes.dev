---
project: build-a-glob-matcher
lesson: 1
title: A literal name match
overview: 'Every glob is a pattern with special characters sprinkled into an ordinary name, so the honest place to start is a pattern with no special characters at all - a plain string that must match exactly. Today you build the one function the whole library grows out of.'
goal: 'Match a pattern against a name by exact equality.'
spec:
  scenario: A pattern with no wildcards matches only the identical name
  status: failing
  lines:
    - kw: Given
      text: 'the pattern ''foo'''
    - kw: When
      text: 'Match is called against various names'
    - kw: Then
      text: 'Match("foo", "foo") is true, and Match("foo", "bar") is false'
    - kw: And
      text: 'Match("foo", "food") is false and Match("foo", "fo") is false - a literal pattern matches the whole name, not a prefix or a substring'
code:
  lang: go
  source: |
    // the whole library grows from this one function
    func Match(pattern, name string) bool {
      return pattern == name
    }
checkpoint: 'Match compares a wildcard-free pattern to a name by exact equality. Commit and stop here.'
---

A **glob** is a small pattern language for matching filenames: `*.txt`, `src/**`,
`[abc]`. Before any of the special characters mean anything, the base case has to
be right - a pattern that is just an ordinary name matches **only** that exact
name. Not a prefix, not a substring, the whole thing.

Today's `Match` is deliberately trivial: string equality. Every later lesson keeps
the same signature - `Match(pattern, name)` returning a boolean - and teaches one
more character (`?`, `*`, `[`, `\`, `/`) how to behave. Getting the literal case
and the signature pinned now means each new feature is a small, local change to one
function.
