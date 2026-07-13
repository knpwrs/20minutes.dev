---
project: build-a-glob-matcher
lesson: 2
title: The single-character wildcard
overview: 'The question mark is the simplest wildcard - it matches exactly one character, no more and no fewer. Adding it turns Match from a string comparison into a real position-by-position matcher, the shape every other wildcard will slot into.'
goal: 'Make the question mark match exactly one character.'
spec:
  scenario: A question mark matches any single character but never zero
  status: failing
  lines:
    - kw: Given
      text: 'the pattern ''f?o'''
    - kw: When
      text: 'Match is called against various names'
    - kw: Then
      text: 'Match("f?o", "foo") is true and Match("f?o", "fao") is true - the question mark stands for any one character'
    - kw: And
      text: 'Match("f?o", "fo") is false (the question mark needs one character) and Match("f?o", "fooo") is false, and Match("?", "") is false'
code:
  lang: go
  source: |
    // walk pattern and name together, one character at a time
    func Match(pattern, name string) bool {
      if pattern == "" {
        return name == ""
      }
      if name != "" && (pattern[0] == '?' || pattern[0] == name[0]) {
        return Match(pattern[1:], name[1:])   // consume one of each
      }
      return false
    }
checkpoint: 'The question mark matches exactly one character. Commit and stop here.'
---

The literal comparison from lesson 1 can no longer be a single `==`: a `?` in the
pattern must line up against **some** character in the name, so the matcher has to
walk the two strings together, one position at a time. That walk is the skeleton
every wildcard plugs into.

The rule for `?` is that it matches **any one character**, but never zero - so
`f?o` matches `foo` and `fao`, but not `fo` (nothing for the `?` to consume) and
not `fooo` (a leftover `o`). The recursion makes this precise: at each step, if the
pattern character is `?` or equals the name character, consume one from each and
continue; when the pattern runs out, the name must be exactly used up too. Keep
this recursive shape - the star in the next lesson is one more case inside it.
