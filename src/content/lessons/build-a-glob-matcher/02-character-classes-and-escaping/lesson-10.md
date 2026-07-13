---
project: build-a-glob-matcher
lesson: 10
title: Escaping a metacharacter
overview: 'Sometimes you need to match a literal star or bracket, not use its special meaning. A backslash escapes the next character, stripping its power. Today matchOne learns to honour the escape before it interprets anything.'
goal: 'Make a backslash turn the following metacharacter into a literal.'
spec:
  scenario: A backslash forces the next character to be literal
  status: failing
  lines:
    - kw: Given
      text: 'patterns that escape a metacharacter'
    - kw: When
      text: 'Match is called against various names'
    - kw: Then
      text: 'a backslash escapes the next character: Match("\*", "*") is true and Match("\*", "a") is false'
    - kw: And
      text: 'Match("\?", "?") is true, Match("a\[b", "a[b") is true, and a doubled backslash Match("\\", "\") matches one literal backslash'
code:
  lang: go
  source: |
    // the very first thing matchOne checks: a backslash escapes what follows
    if pat[p] == '\\' && p+1 < len(pat) {
      return pat[p+1] == c, p + 2   // match the escaped char literally, span two
    }
    // ... then the '?', '[', and literal cases ...
checkpoint: 'A backslash escapes the following metacharacter to a literal. Commit and stop here.'
---

Every pattern language needs an escape hatch: a way to say "I mean a literal `*`,
not the wildcard." The convention is a **backslash** - `\*` matches a single literal
star, `\?` a literal question mark, `\[` a literal open bracket, and `\\` a single
literal backslash. The escape strips the special meaning from exactly one following
character.

The check goes at the **top** of `matchOne`, before it looks for `?` or `[`: if the
token is a backslash and something follows, match the name character against that
next character literally and advance by two. Putting it first is what makes `\[`
match a bracket instead of starting a class. The star needs no special handling
here - the main scan only treats a bare `*` as a wildcard, and a `\*` reaches
`matchOne` as an escape - so the wildcard branch never even sees it. With escaping
in place, the single-segment matcher is complete; next it learns about paths.
