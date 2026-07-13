---
project: build-a-glob-matcher
lesson: 22
title: 'Capstone: a real gitignore verdict'
overview: 'The finale is the whole point of the project - compile a realistic .gitignore and get the exact ignore-or-keep verdict for every candidate path. Comments, an anchored rule, a directory rule, a broad ignore, and a negation all fire at once, and precedence decides the close calls.'
goal: 'Decide the exact ignore-or-keep verdict for a set of paths against a realistic gitignore.'
spec:
  scenario: A realistic gitignore gives the exact verdict for every path
  status: failing
  lines:
    - kw: Given
      text: 'the .gitignore lines: "# build artifacts", "/dist", "node_modules/", "*.log", "!keep.log"'
    - kw: When
      text: 'Ignored is asked about candidate paths'
    - kw: Then
      text: 'the anchored, directory, and log rules ignore: Ignored("dist", true), Ignored("dist/bundle.js", false), Ignored("node_modules", true), Ignored("a/node_modules", true), and Ignored("app.log", false) are all true'
    - kw: And
      text: 'anchoring and negation keep the rest: Ignored("src/dist", true) is false, Ignored("keep.log", false) is false and Ignored("logs/keep.log", false) is false (re-included by the bang), and Ignored("README.md", false) is false'
code:
  lang: go
  source: |
    g := Compile("# build artifacts\n/dist\nnode_modules/\n*.log\n!keep.log")
    g.Ignored("dist", true)          // true  - anchored, at base
    g.Ignored("dist/bundle.js", false) // true - inside an ignored directory
    g.Ignored("src/dist", true)      // false - /dist is anchored to the base
    g.Ignored("keep.log", false)     // false - *.log then !keep.log re-includes
    g.Ignored("logs/keep.log", false) // false - the bang floats to any depth
checkpoint: 'Your matcher gives the exact gitignore verdict for every path. The project is complete; commit and stop here.'
---

This is the deliverable the whole project was built for: a real `.gitignore`,
compiled once, answering the exact question git answers - **is this path ignored?**
Every layer fires at once. The `# build artifacts` comment is dropped at compile
time. `/dist` is anchored, so it ignores `dist` at the base and everything inside it
by the ancestor rule, but not `src/dist` deeper in the tree. `node_modules/` is a
directory rule that floats to any depth, ignoring `node_modules` and `a/node_modules`
as directories. `*.log` ignores every log by basename, and `!keep.log` carves the
exception back out - and because it is the last matching rule, `keep.log` and even
`logs/keep.log` are kept.

Nine paths, nine exact verdicts, and each one lands only because anchoring, directory
typing, basename floating, ancestor exclusion, and last-match-wins precedence all
agree. From a single-line literal comparison you have built a complete glob pattern
language - wildcards, classes, escapes, path segments, the double-star - and the
gitignore engine that git itself implements, minus a couple of corners the caveats
name. That is a real glob and gitignore matcher, and it is yours.
