---
project: build-a-glob-matcher
lesson: 16
title: Anchored patterns
overview: 'A pattern with a slash in it is anchored - it matches from the base directory, not at any depth. Today Compile marks anchored rules and Ignored matches them against the whole path with your path-aware Match.'
goal: 'Anchor a pattern that has a leading or interior slash to the base directory.'
spec:
  scenario: A slash in the pattern anchors it to the base
  status: failing
  lines:
    - kw: Given
      text: 'patterns with a leading or interior slash'
    - kw: When
      text: 'Ignored is asked about a path'
    - kw: Then
      text: 'a leading slash anchors to the base: Compile("/foo").Ignored("foo", false) is true and Compile("/foo").Ignored("a/foo", false) is false'
    - kw: And
      text: 'an interior slash also anchors: Compile("a/b").Ignored("a/b", false) is true and Compile("a/b").Ignored("x/a/b", false) is false, while a slash-free pattern still floats - Compile("foo").Ignored("a/foo", false) is true'
code:
  lang: go
  source: |
    // in Compile: decide anchoring, strip a leading slash
    anchored := false
    if strings.HasPrefix(line, "/") { anchored = true; line = line[1:] }
    if strings.Contains(line, "/") { anchored = true }
    // in Ignored, per rule:
    if r.Anchored {
      ok = Match(r.Pattern, path)      // whole path, path-aware
    } else {
      ok = matchSegment(r.Pattern, base)
    }
checkpoint: 'A pattern with a slash anchors to the base directory. Commit and stop here.'
---

The slash decides where a pattern applies. A pattern that contains a slash -
either a **leading** one like `/foo` or an **interior** one like `a/b` - is
**anchored** to the directory the `.gitignore` lives in. It matches only from the
base, not at arbitrary depth: `/foo` ignores `foo` but not `a/foo`, and `a/b`
ignores `a/b` but not `x/a/b`. A pattern with **no** slash still floats and matches
the basename anywhere, as in the last lesson.

`Compile` decides this once: if the line starts with `/`, mark it anchored and drop
that leading slash (it was only a signal); if the line contains a slash anywhere,
mark it anchored too. Then `Ignored` branches on the flag - an anchored rule is
matched against the **whole path** with the path-aware `Match` you built, a
floating rule against the basename with `matchSegment`. This is exactly why `Match`
splits on the slash: an anchored gitignore pattern is just a path glob rooted at the
base, and everything it does - segments, the double-star - now works for gitignore
for free.
