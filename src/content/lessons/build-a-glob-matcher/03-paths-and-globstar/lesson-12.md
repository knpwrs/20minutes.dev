---
project: build-a-glob-matcher
lesson: 12
title: The double-star, across directories
overview: 'A single star stays in one segment, but you often want to match at any depth - every .go file anywhere under a tree. The double-star is a segment that spans zero or more directories. Today you add it by backtracking over path segments, and pin how it differs from a single star.'
goal: 'Make a double-star segment match any number of directories, including none.'
spec:
  scenario: A double-star spans directory boundaries
  status: failing
  lines:
    - kw: Given
      text: 'patterns with a double-star segment'
    - kw: When
      text: 'Match backtracks over segments'
    - kw: Then
      text: 'a leading double-star matches at any depth: Match("**/foo", "foo") is true, Match("**/foo", "a/b/foo") is true, and Match("a/**/b", "a/x/y/b") is true'
    - kw: And
      text: 'a trailing double-star spans the rest: Match("foo/**", "foo/a/b") is true and Match("foo/**", "foo") is true, while a single star does not cross a slash - Match("a/*", "a/b/c") is false but Match("a/**", "a/b/c") is true'
code:
  lang: go
  source: |
    func matchSegments(pat, name []string) bool {
      if len(pat) == 0 { return len(name) == 0 }
      if pat[0] == "**" {                      // try eating 0,1,2,... segments
        for i := 0; i <= len(name); i++ {
          if matchSegments(pat[1:], name[i:]) { return true }
        }
        return false
      }
      if len(name) == 0 { return false }
      return matchSegment(pat[0], name[0]) && matchSegments(pat[1:], name[1:])
    }
checkpoint: 'A double-star segment matches across directory boundaries. Commit and stop here.'
---

A single star is confined to one segment, but the common need is "anywhere below
here" - every test file under `src`, every `.go` file in the tree. That is the
**double-star**: a path segment of exactly `**` that matches **zero or more** whole
directory segments. `**/foo` finds `foo` at the top or buried deep; `a/**/b`
matches `a/b`, `a/x/b`, `a/x/y/b`; `foo/**` matches everything under `foo`, and
`foo` itself when the double-star matches nothing.

The single-segment matcher cannot express this, so `Match` now backtracks over the
**segment list**. At a `**`, try letting it consume 0 segments, then 1, then 2, and
recurse on the rest for each - the first split that works wins. Every other segment
matches one-to-one through `matchSegment` as before. The contrast is the thing to
hold onto: `a/*` cannot match `a/b/c` because a single star is one segment, but
`a/**` can, because the double-star spans them. With paths and the double-star done,
the glob engine is complete - and it becomes the workhorse for gitignore.
