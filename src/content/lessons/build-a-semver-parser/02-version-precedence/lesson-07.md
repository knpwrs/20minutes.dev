---
project: build-a-semver-parser
lesson: 7
title: Comparing the numeric core
overview: Ordering versions is the heart of the library, and it starts with the three core numbers compared in order of significance. Today you build the compare function that returns which of two versions is lower, equal, or higher by their core alone.
goal: Compare two versions by major, then minor, then patch, returning -1, 0, or 1.
spec:
  scenario: The numeric core orders versions
  status: failing
  lines:
    - kw: Given
      text: 'two versions with no prerelease'
    - kw: When
      text: 'they are compared with Compare'
    - kw: Then
      text: 'Compare(1.2.3, 1.2.4) is -1, Compare(1.3.0, 1.2.9) is 1, and Compare(2.0.0, 1.9.9) is 1'
    - kw: And
      text: 'Compare(1.2.3, 1.2.3) is 0'
code:
  lang: go
  source: |
    // Compare major first; only if equal, compare minor; only if equal, compare patch.
    // Return -1 if a < b, 1 if a > b, 0 if equal. Prerelease is handled in later lessons.
    func Compare(a, b Version) int { /* ... */ }
checkpoint: You can order two versions by their numeric core. Commit and stop here.
---

Everything about ranges - "is this version at least `1.2.0`?", "is it below
`2.0.0`?" - reduces to comparing two versions, so `Compare` is the workhorse of
the library. The SemVer rule for the numeric core is **lexicographic by
significance**: compare `Major` first, and only if the majors are equal look at
`Minor`, and only if those are equal look at `Patch`. Each is an ordinary numeric
comparison. So `2.0.0` outranks `1.9.9` on major alone, and `1.3.0` outranks
`1.2.9` on minor without patch ever mattering.

Return a three-way result - `-1`, `0`, or `1` - rather than a boolean, because
ranges need to know less-than, equal, and greater-than as distinct answers, and a
single signed result composes cleanly (you can build every operator, `<`, `<=`,
`=`, `>=`, `>`, on top of it later). Keep prerelease out of it today: assume both
versions have an empty prerelease. The next lessons layer the prerelease rules on
top of this core comparison, which stays exactly as you write it now.
