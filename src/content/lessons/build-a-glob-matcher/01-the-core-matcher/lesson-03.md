---
project: build-a-glob-matcher
lesson: 3
title: The star, by backtracking
overview: 'The star matches a run of characters of any length, including none at all. The natural way to write it is to try every split point and recurse - a correct backtracking matcher, and the honest first version before we make it fast.'
goal: 'Make the star match any run of characters, using recursive backtracking.'
spec:
  scenario: A star matches zero or more characters
  status: failing
  lines:
    - kw: Given
      text: 'patterns that contain a star'
    - kw: When
      text: 'Match is called against various names'
    - kw: Then
      text: 'Match("*.txt", "a.txt") is true and Match("*.txt", "a.md") is false, and Match("a*", "a") is true (the star matches an empty run)'
    - kw: And
      text: 'Match("*", "") is true, Match("*b", "aaab") is true, and Match("*b", "aaa") is false'
code:
  lang: go
  source: |
    // a star: try matching the rest here (star ate nothing),
    // or let the star swallow one more character and try again
    if pattern[0] == '*' {
      return Match(pattern[1:], name) ||
        (name != "" && Match(pattern, name[1:]))
    }
checkpoint: 'The star matches any run of characters through backtracking. Commit and stop here.'
---

The `*` is the wildcard everyone reaches for: it matches **zero or more** of any
character. Because it can match a run of any length, the matcher cannot know up
front how much the star should swallow - so it **tries every possibility**. At a
star it either matches the rest of the pattern right here (the star consumed
nothing) or consumes one more character of the name and tries the same star again.
The first branch that succeeds wins; if neither does, there is no match. That is
**backtracking**.

This version is correct and easy to trust, which is exactly why it comes first.
`*.txt` matches `a.txt` (star swallows `a`) but not `a.md` (the literal `.txt`
never lines up), and `a*` matches `a` because the star is happy to match nothing.
The one flaw is hidden: on a pattern packed with stars, this recursion can explore
an exponential number of splits. The next lesson keeps the exact same behaviour but
removes that cliff.
