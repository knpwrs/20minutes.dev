---
project: build-a-glob-matcher
lesson: 18
title: The double-star in gitignore
overview: 'Because an anchored pattern is matched by the path-aware Match, the double-star already works in gitignore rules - **/foo, logs/**, a/**/z all mean what git says they mean. Today you prove that the two engines compose, with little or no new code.'
goal: 'Confirm anchored gitignore patterns support the double-star across directories.'
spec:
  scenario: Anchored rules inherit double-star spanning
  status: failing
  lines:
    - kw: Given
      text: 'anchored patterns that use a double-star'
    - kw: When
      text: 'Ignored is asked about a path'
    - kw: Then
      text: 'a leading and interior double-star span directories: Compile("**/build").Ignored("a/b/build", false) is true and Compile("a/**/z").Ignored("a/x/y/z", false) is true'
    - kw: And
      text: 'a trailing double-star spans the subtree but stays anchored: Compile("logs/**").Ignored("logs/a/b.log", false) is true, while Compile("logs/**").Ignored("other/a.log", false) is false'
code:
  lang: go
  source: |
    // no new matcher code: an anchored rule already delegates to Match,
    // and Match already handles the "**" segment. This lesson is the proof.
    Compile("**/build").Ignored("a/b/build", false) // true, via Match("**/build", "a/b/build")
    Compile("logs/**").Ignored("logs/a/b.log", false) // true
    Compile("logs/**").Ignored("other/a.log", false)  // false - still anchored at logs
checkpoint: 'Anchored gitignore rules support the double-star through Match. Commit and stop here.'
---

This is a **payoff** lesson - the satisfying moment where two things you built
separately turn out to already fit together. A gitignore pattern that contains a
slash is anchored, and lesson 16 routes anchored rules through the path-aware
`Match`. `Match` already understands a `**` segment. So the moment you wrote the
double-star, every anchored gitignore rule gained it too: `**/build` ignores a
`build` directory at any depth, `a/**/z` spans the middle, and `logs/**` ignores the
whole subtree under `logs`.

Expect to write **no new matching code** today - the test is the lesson. That a
green test can come from code you already have is not a gap; it is the sign the
design was right. The one thing worth pinning is that the anchor still holds:
`logs/**` matches paths **under** `logs`, not a stray `other/a.log`, because the
first segment must still match `logs` before the double-star gets its turn. With
this, the matching machinery is done; what remains is how rules **combine**.
