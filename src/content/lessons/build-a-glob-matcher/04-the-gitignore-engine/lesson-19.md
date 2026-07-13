---
project: build-a-glob-matcher
lesson: 19
title: Negation and last-match-wins
overview: 'A leading bang re-includes a path an earlier rule ignored - the mechanism behind ignore everything, keep this one. It only makes sense with an ordering rule: the last matching pattern wins. Today Ignored walks all rules in order and lets the final match decide.'
goal: 'Let a bang rule re-include a path, with the last matching rule deciding.'
spec:
  scenario: A negation re-includes, and order decides conflicts
  status: failing
  lines:
    - kw: Given
      text: 'a rule-set with a broad ignore and a bang exception'
    - kw: When
      text: 'Ignored walks every rule in order'
    - kw: Then
      text: 'a bang re-includes: Compile("*.log\n!keep.log").Ignored("keep.log", false) is false, while Compile("*.log\n!keep.log").Ignored("app.log", false) is true'
    - kw: And
      text: 'order decides: reversing to Compile("!keep.log\n*.log").Ignored("keep.log", false) is true, because the later broad rule wins'
code:
  lang: go
  source: |
    // in Compile: a leading '!' negates (checked before the escape cases)
    if line[0] == '!' { negated = true; line = line[1:] }
    // in Ignored: walk ALL rules; the last match sets the verdict
    ignored := false
    for _, r := range g.rules {
      if r.DirOnly && !isDir { continue }
      ok := r.Anchored && Match(r.Pattern, path) ||
            !r.Anchored && matchSegment(r.Pattern, base)
      if ok { ignored = !r.Negated }
    }
    return ignored
checkpoint: 'A bang re-includes a path, and the last matching rule wins. Commit and stop here.'
---

The last gitignore convention is the one that makes real ignore files expressive: a
pattern with a leading `!` is a **negation** that **re-includes** a path an earlier
rule ignored. The idiom is "ignore a whole class, then carve out an exception" -
`*.log` then `!keep.log`. Negation is meaningless without an ordering rule, and
git's is simple: **the last pattern that matches decides**. Whichever rule matches
last - ignore or re-include - wins.

So `Ignored` stops returning on the first match. It walks **every** rule in order,
and each rule that matches sets the running verdict: a normal rule sets ignored, a
`!` rule clears it. The final state after the whole walk is the answer. Order is now
load-bearing: `*.log` then `!keep.log` keeps `keep.log`, but flip them and the broad
`*.log` matches last and wins, so `keep.log` is ignored again. Parse the `!` before
the other leading-marker cases, since a bare `!` is negation while `\!` was the
escaped literal from lesson 14.
