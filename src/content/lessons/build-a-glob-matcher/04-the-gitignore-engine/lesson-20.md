---
project: build-a-glob-matcher
lesson: 20
title: Ignoring a directory ignores its contents
overview: 'When a directory is ignored, everything inside it is ignored too - and git will not let you re-include a file whose parent directory is excluded. Today Ignored checks a path''s ancestors before deciding.'
goal: 'Make a path ignored when any ancestor directory is ignored.'
spec:
  scenario: An ignored ancestor directory ignores everything under it
  status: failing
  lines:
    - kw: Given
      text: 'a rule that ignores a directory'
    - kw: When
      text: 'Ignored is asked about a path inside it'
    - kw: Then
      text: 'contents are ignored: Compile("build/").Ignored("build/app.o", false) is true, and the directory itself Compile("build/").Ignored("build", true) is true'
    - kw: And
      text: 'an excluded parent cannot be re-included: Compile("build/\n!build/app.o").Ignored("build/app.o", false) is true, while an unrelated path Compile("build/").Ignored("src/main.go", false) is false'
code:
  lang: go
  source: |
    // rename the last-match walk to decide(path, isDir); wrap it:
    func (g *Gitignore) Ignored(path string, isDir bool) bool {
      segs := strings.Split(path, "/")
      for i := 1; i < len(segs); i++ {          // each ancestor directory
        if g.decide(strings.Join(segs[:i], "/"), true) {
          return true                            // parent excluded -> excluded
        }
      }
      return g.decide(path, isDir)
    }
checkpoint: 'A path under an ignored directory is itself ignored. Commit and stop here.'
---

Ignoring a directory means ignoring its whole subtree - `build/` does not just hide
the `build` directory, it hides `build/app.o` and everything below. Git enforces
this strictly: once a parent directory is excluded, you **cannot** re-include a file
inside it with a `!` rule, because git never even descends into an ignored
directory to see the exception. This is the one place ordering does not save you.

The implementation is a short ancestor walk. Extract the last-match logic from the
previous lesson into a helper - call it `decide` - that judges a single path. Then
`Ignored` first asks `decide` about each **ancestor directory** of the path (each
prefix, treated as a directory); if any is ignored, the answer is ignored, full
stop. Only if no ancestor is excluded does it fall through to `decide` on the path
itself. So `build/app.o` is ignored because `build` is, even alongside
`!build/app.o`, while a path with no ignored ancestor is judged normally. This is
the last piece of real gitignore behaviour - the capstones put it all together.
