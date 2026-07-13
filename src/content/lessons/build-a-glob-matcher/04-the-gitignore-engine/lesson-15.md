---
project: build-a-glob-matcher
lesson: 15
title: Ignoring by basename
overview: 'The core question is finally answerable: does a rule-set ignore a path? A plain pattern with no slash floats - it matches the file''s basename at any depth. Today Ignored answers for these floating patterns.'
goal: 'Make a slash-free pattern match a path''s basename at any depth.'
spec:
  scenario: A floating pattern matches the basename anywhere
  status: failing
  lines:
    - kw: Given
      text: 'a rule-set with a slash-free pattern'
    - kw: When
      text: 'Ignored is asked about a path'
    - kw: Then
      text: 'a floating pattern matches the basename at any depth: Compile("*.log").Ignored("a.log", false) is true and Compile("*.log").Ignored("dir/a.log", false) is true'
    - kw: And
      text: 'it matches the basename only, not other segments: Compile("*.log").Ignored("a.txt", false) is false and Compile("foo").Ignored("x/y/foo", false) is true'
code:
  lang: go
  source: |
    func (g *Gitignore) Ignored(path string, isDir bool) bool {
      base := path
      if i := strings.LastIndex(path, "/"); i >= 0 {
        base = path[i+1:]         // the final path segment
      }
      for _, r := range g.rules {
        if matchSegment(r.Pattern, base) { return true }
      }
      return false
    }
checkpoint: 'A floating pattern ignores a path by matching its basename. Commit and stop here.'
---

Now the payoff: `Ignored(path, isDir)` reports whether the rule-set ignores a
given path. The simplest and most common gitignore rule is a pattern with **no
slash** in it, like `*.log` or `build`. Such a pattern **floats**: it matches the
path's **basename** - the last segment - no matter how deep the path is. So `*.log`
ignores `a.log` and `dir/a.log` and `x/y/z.log` alike, because in each the final
segment ends in `.log`.

Because a floating pattern only ever looks at one segment, you match it with
`matchSegment` - the single-segment engine from the first two chapters, reused
untouched. Pull the basename off the path and test each rule against it; ignored if
any rule matches. The `isDir` argument is here from the start because a coming
lesson needs it, but today it is unused. This is the whole engine in miniature;
anchoring, directories, and negation each refine how a rule matches from here.
