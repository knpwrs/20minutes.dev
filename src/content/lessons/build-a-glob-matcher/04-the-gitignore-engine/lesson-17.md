---
project: build-a-glob-matcher
lesson: 17
title: Directory-only rules
overview: 'A trailing slash means the rule matches directories only - build/ ignores the build directory but never a file named build. Today Compile records that and Ignored consults the isDir flag it has been carrying all along.'
goal: 'Make a trailing slash restrict a rule to directories.'
spec:
  scenario: A trailing slash matches only directories
  status: failing
  lines:
    - kw: Given
      text: 'a pattern that ends in a slash'
    - kw: When
      text: 'Ignored is asked about a path with its isDir flag'
    - kw: Then
      text: 'the rule matches a directory but not a file: Compile("build/").Ignored("build", true) is true and Compile("build/").Ignored("build", false) is false'
    - kw: And
      text: 'it still floats to any depth as a directory rule: Compile("build/").Ignored("src/build", true) is true, and Compile("build/").Ignored("build.txt", false) is false'
code:
  lang: go
  source: |
    // in Compile, strip a trailing slash FIRST (before deciding anchoring)
    if strings.HasSuffix(line, "/") { dirOnly = true; line = line[:len(line)-1] }
    if strings.HasPrefix(line, "/") { anchored = true; line = line[1:] }
    if strings.Contains(line, "/") { anchored = true }
    // in Ignored, per rule:
    if r.DirOnly && !isDir { continue }   // a dir-only rule ignores files
checkpoint: 'A trailing slash makes a rule match directories only. Commit and stop here.'
---

A trailing slash on a pattern is a **type** constraint: `build/` matches a
**directory** named `build`, and never a regular file named `build`. This lets you
ignore a whole output directory without accidentally ignoring an unrelated file of
the same name. It is why `Ignored` has taken an `isDir` argument since the first
gitignore lesson - the caller knows whether the path is a directory, and a dir-only
rule consults it.

Two changes make it work. In `Compile`, strip a trailing slash and set `DirOnly` -
and do it **before** the anchoring checks, or the slash you are removing would
wrongly look like an interior slash and anchor the pattern. In `Ignored`, skip a
`DirOnly` rule when the path is not a directory. Everything else is unchanged:
`build/` is still slash-free after stripping, so it floats and matches a `build`
directory at any depth, while `build.txt` - a file - is never touched by it.
