---
project: build-a-regex-engine
lesson: 17
title: Bounded repetition
overview: '`{n,m}` bounds repetition between a floor and a ceiling, and `{n,}` sets only a floor. Desugaring both into copies plus optionals or a star means no new matching code - and it closes the chapter.'
goal: Parse `x{n,m}` and `x{n,}` by expanding into required copies plus optional or starred ones.
spec:
  scenario: Bounded and open-ended counts expand into existing quantifiers
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "^a{2,3}$"'
    - kw: When
      text: 'Match is called against "aaa"'
    - kw: Then
      text: 'it reports true, and "^a{2,3}$" against "a" reports false'
    - kw: And
      text: 'Match for "^a{2,3}$" against "aaaa" reports false'
    - kw: And
      text: 'Match for "^a{2,}$" against "aaaa" reports true, and "^a{2,}$" against "a" reports false'
    - kw: And
      text: 'Match for "^(cat|dog)s?$" against "cats" reports true, and against "fish" reports false'
code:
  lang: go
  source: |
    // Desugar using nodes you already have:
    //   x{2,3} -> Concat[x, x, x?]      (2 required, 1 optional)
    //   x{2,}  -> Concat[x, x, x*]      (2 required, then any number)
    // n required copies, then (m-n) Quest copies, or a Star if open.
checkpoint: '`{n,m}` and `{n,}` expand into copies plus optionals or a star, completing the syntax. Commit and stop here.'
---

Bounded repetition generalizes yesterday's exact count. `a{2,3}` matches two or three
`a`s; `a{2,}` matches two or more. Both desugar cleanly into quantifiers you already
built: the `n` required copies are plain repeats, the optional ones up to `m` are
`Quest` nodes, and an open-ended `{n,}` caps off with a `Star`. So `a{2,3}` becomes
`a a a?` and `a{2,}` becomes `a a a*`. Again the matcher gains nothing new - all the
work is in the parser's suffix handler.

That completes the surface syntax of your engine. Take a moment with the last line of
the spec: `^(cat|dog)s?$` combines grouping, alternation, an optional, and anchors,
and it correctly accepts `cat`, `cats`, `dog`, `dogs` while rejecting `fish`. You've
built a genuinely capable matcher. But it is still a **backtracker**, and some
patterns can make it explore an exponential number of paths. The next chapter builds
a completely different matching engine that never does.
