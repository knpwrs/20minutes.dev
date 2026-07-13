---
project: build-a-glob-matcher
lesson: 5
title: A character class
overview: 'A bracket expression matches one character from a set, like [aeiou] for any vowel. Today matchOne learns to scan a class and test membership - the first token that spans more than one pattern character.'
goal: 'Make a bracket class match one character drawn from the set inside it.'
spec:
  scenario: A class matches exactly one character from its set
  status: failing
  lines:
    - kw: Given
      text: 'patterns containing a bracket class'
    - kw: When
      text: 'Match is called against various names'
    - kw: Then
      text: 'Match("[abc]", "b") is true and Match("[abc]", "d") is false'
    - kw: And
      text: 'Match("h[aeiou]t", "hat") is true, Match("h[aeiou]t", "hit") is true, and Match("h[aeiou]t", "hct") is false'
code:
  lang: go
  source: |
    // inside matchOne, when the token starts with '['
    if pat[p] == '[' {
      j := p + 1
      matched := false
      for j < len(pat) && pat[j] != ']' {
        if pat[j] == c { matched = true }
        j++
      }
      return matched, j + 1   // j is at ']'; the token ends after it
    }
checkpoint: 'A bracket class matches one character from its set. Commit and stop here.'
---

A **bracket expression** - `[abc]` - matches exactly **one** character, drawn from
the set listed between the brackets. It is a `?` with a restricted alphabet: `h[aeiou]t`
matches `hat`, `hit`, `hot`, but not `hct`, because `c` is not one of the listed
characters. Like `?`, it consumes exactly one character of the name.

This is the first token that spans several pattern characters, which is precisely
why lesson 4 pulled `matchOne` out into its own helper: it scans from the opening
`[` to the closing `]`, checks whether the name character is one of the members,
and returns the index **past** the `]` so the main scan continues after the whole
class. Today handles a plain list of characters; ranges, negation, and the awkward
edge cases each extend this same scanner in the next few lessons.
