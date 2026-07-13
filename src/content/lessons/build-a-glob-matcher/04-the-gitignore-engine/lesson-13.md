---
project: build-a-glob-matcher
lesson: 13
title: Parsing a gitignore file
overview: 'A .gitignore is a list of glob patterns, one per line, with a few conventions on top. The first is structural - blank lines and comment lines are skipped. Today you compile the file into rules, laying down the Rule type the whole engine hangs on.'
goal: 'Compile a gitignore text into a list of rules, skipping blanks and comments.'
spec:
  scenario: Compile keeps pattern lines and drops blanks and comments
  status: failing
  lines:
    - kw: Given
      text: 'a gitignore text with blank lines and a comment'
    - kw: When
      text: 'Compile parses it into rules'
    - kw: Then
      text: 'blank lines and lines starting with a hash are skipped: Compile("# a comment\n\nfoo\nbar").Rules() has length 2'
    - kw: And
      text: 'the rules carry patterns "foo" and "bar", and the Rule type also holds Negated, DirOnly, and Anchored fields (all false so far) for the lessons ahead'
code:
  lang: go
  source: |
    type Rule struct {
      Pattern  string
      Negated  bool     // set by a later lesson (leading '!')
      DirOnly  bool     // set by a later lesson (trailing '/')
      Anchored bool     // set by a later lesson (leading or interior '/')
    }
    type Gitignore struct{ rules []Rule }
    func Compile(text string) *Gitignore {
      g := &Gitignore{}
      for _, line := range strings.Split(text, "\n") {
        if line == "" || strings.HasPrefix(line, "#") { continue }
        g.rules = append(g.rules, Rule{Pattern: line})
      }
      return g
    }
checkpoint: 'Compile turns a gitignore text into rules, skipping blanks and comments. Commit and stop here.'
---

Everything you have built - wildcards, classes, paths, the double-star - was
groundwork for the real deliverable: a **gitignore** engine that decides whether a
path is ignored. A `.gitignore` is just a list of glob patterns, one per line, with
a small set of conventions layered on. The most basic: a **blank** line matches
nothing and is skipped, and a line whose first character is `#` is a **comment**,
also skipped.

Today's `Compile` reads the text line by line and collects the pattern lines into a
list of `Rule` values. Give the `Rule` its **full shape now** - `Pattern` plus the
`Negated`, `DirOnly`, and `Anchored` flags - even though the next several lessons
are what actually set those flags. Fixing the type up front means each later
convention is a small tweak to the parser, never a reshaping of the data. The
`Rules` accessor is there so tests (and you) can see exactly what a file compiled
to.
