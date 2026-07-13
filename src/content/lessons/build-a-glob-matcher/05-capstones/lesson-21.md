---
project: build-a-glob-matcher
lesson: 21
title: 'Capstone: filtering a path list'
overview: 'The glob engine is complete, so put it to work: filter a list of paths by a single pattern, the way a shell or a build tool expands a glob. This capstone exercises the double-star, a star, and a class together against real-looking paths.'
goal: 'Filter a list of paths by a glob pattern, keeping exactly the matches.'
spec:
  scenario: A pattern selects exactly the matching paths
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "src/**/*.go" and the paths ["src/main.go", "src/a/b/util.go", "src/data/model.go", "docs/readme.md", "main.go", "src/a/notes.txt"]'
    - kw: When
      text: 'Filter keeps the paths the pattern matches'
    - kw: Then
      text: 'it returns exactly ["src/main.go", "src/a/b/util.go", "src/data/model.go"] - the double-star spans any depth under src and the star selects the .go files'
    - kw: And
      text: 'classes compose with the double-star: Match("src/**/[a-c]*.go", "src/x/bar.go") is true and Match("src/**/[a-c]*.go", "src/x/zed.go") is false'
code:
  lang: go
  source: |
    func Filter(pattern string, paths []string) []string {
      var out []string
      for _, p := range paths {
        if Match(pattern, p) { out = append(out, p) }
      }
      return out
    }
checkpoint: 'Filter selects exactly the paths a glob matches. The glob engine is proven end to end. Commit and stop here.'
---

This is what a glob is **for**: expanding a pattern against a set of paths. `Filter`
is a three-line loop over `Match`, but the pattern it runs makes every earlier
lesson pull its weight at once. `src/**/*.go` anchors at `src`, spans any number of
directories with the double-star, and selects the `.go` files with a single star in
the final segment - so it keeps `src/main.go`, `src/a/b/util.go`, and
`src/data/model.go`, while rejecting a doc file, a top-level `main.go` outside
`src`, and a `.txt` file at the right depth but the wrong extension.

The second check shows the pieces still compose in any combination: a **class** in
the last segment, `[a-c]*.go`, nested under a double-star, matches `bar.go` (starts
with `b`) but not `zed.go` (starts with `z`). One small `Match` function, and the
whole POSIX-and-git pattern language falls out of it. Next, the other public entry
point gets its finale.
