---
project: build-a-glob-matcher
lesson: 11
title: The path separator
overview: 'Real patterns match paths, not bare names, and the slash is special - a star must not leap across a directory boundary. Today Match becomes path-aware by splitting on the slash and matching segment by segment, with your finished single-segment matcher doing the work inside each one.'
goal: 'Match paths segment by segment so the star and question mark never cross a slash.'
spec:
  scenario: The star stays inside one path segment
  status: failing
  lines:
    - kw: Given
      text: 'patterns and names that contain slashes'
    - kw: When
      text: 'Match splits both on the slash and matches segment against segment'
    - kw: Then
      text: 'Match("*.txt", "a.txt") is true but Match("*.txt", "dir/a.txt") is false, while Match("*/*.txt", "dir/a.txt") is true'
    - kw: And
      text: 'the question mark never crosses a slash - Match("a?b", "a/b") is false - and the segment counts must line up: Match("a/b/c", "a/b/c") is true and Match("a/b", "a/b/c") is false'
code:
  lang: go
  source: |
    // rename the finished single-segment matcher to matchSegment,
    // then make Match path-aware
    func Match(pattern, name string) bool {
      pat := strings.Split(pattern, "/")
      seg := strings.Split(name, "/")
      if len(pat) != len(seg) { return false }
      for i := range pat {
        if !matchSegment(pat[i], seg[i]) { return false }
      }
      return true
    }
checkpoint: 'Match works path-aware, one segment at a time. Commit and stop here.'
---

Up to now a pattern matched a single name. Paths introduce a boundary that must be
respected: a `*` should match within one directory level, not swallow slashes and
leap across directories. The clean way to get this is to stop treating the whole
path as one string. **Split** the pattern and the name on `/`, then match segment
against segment - the `*` and `?` and classes you built all operate **inside** a
segment, which contains no slashes, so they simply cannot cross one.

Rename your finished matcher to `matchSegment` and give `Match` the new job of
splitting and looping. Two consequences fall out for free: the segment counts must
line up, so `a/b` does not match `a/b/c`; and a wildcard is confined to its level,
so `*.txt` matches `a.txt` but not `dir/a.txt`, while `*/*.txt` matches `dir/a.txt`
by using one star per segment. All of your earlier single-segment tests still pass,
because a pattern with no slash is just a one-segment path. The one thing this
cannot yet express is "any number of directories" - that is the double-star, next.
