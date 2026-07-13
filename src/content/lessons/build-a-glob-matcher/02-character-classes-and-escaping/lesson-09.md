---
project: build-a-glob-matcher
lesson: 9
title: An unclosed class is a literal
overview: 'A stray open bracket with no closing bracket is not an error - the convention is to treat it as an ordinary character. Today the scanner falls back to a literal open bracket when it never finds the close.'
goal: 'Treat an open bracket with no closing bracket as a literal character.'
spec:
  scenario: A class that never closes matches a literal open bracket
  status: failing
  lines:
    - kw: Given
      text: 'patterns with an unterminated bracket'
    - kw: When
      text: 'Match is called against various names'
    - kw: Then
      text: 'Match("[abc", "[abc") is true and Match("[abc", "a") is false - the open bracket is just a character'
    - kw: And
      text: 'the fallback is local: Match("a[b", "a[b") is true and Match("[", "[") is true'
code:
  lang: go
  source: |
    // after scanning for ']': if we ran off the end, no class was closed
    if j >= len(pat) {
      return pat[p] == c, p + 1   // the '[' is a plain literal character
    }
    return matched, j + 1
checkpoint: 'An unterminated class degrades to a literal open bracket. Commit and stop here.'
---

Real patterns contain stray brackets - a filename like `a[b` is perfectly legal -
so an open `[` that never finds a matching `]` must not break the matcher. The
convention, shared by the shell and by git, is to treat the lone `[` as a **literal
character**. So `[abc` (no closing bracket) matches the four-character name `[abc`,
and matches nothing shorter.

The change is a single fallback: after the scanner walks looking for the closing
`]`, check whether it ran off the end of the pattern. If it did, no class was ever
formed, so return the `[` as an ordinary literal and advance by one - letting the
main scan continue with `abc` as plain characters. Only when a real `]` is found do
you treat the span as a class. This keeps a malformed pattern predictable instead
of throwing, which matters even more once these patterns come from a file.
