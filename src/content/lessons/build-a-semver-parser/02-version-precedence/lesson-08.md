---
project: build-a-semver-parser
lesson: 8
title: A prerelease ranks below its release
overview: A prerelease comes before the release it leads up to, so 1.0.0-alpha is lower than 1.0.0. Today you add that one rule - the presence of a prerelease lowers a version - on top of the core comparison.
goal: When two versions share a core, rank the one carrying a prerelease below the one without.
spec:
  scenario: Having a prerelease lowers a version
  status: failing
  lines:
    - kw: Given
      text: 'versions that share the core 1.0.0'
    - kw: When
      text: 'they are compared'
    - kw: Then
      text: 'Compare(1.0.0-alpha, 1.0.0) is -1 and Compare(1.0.0, 1.0.0-alpha) is 1'
    - kw: And
      text: 'Compare(1.0.0, 1.0.0) is 0, and Compare(1.0.1-alpha, 1.0.0) is still 1 because the core wins first'
code:
  lang: go
  source: |
    // After the core comparison decides equal, look at prerelease PRESENCE:
    //   both absent  -> 0
    //   only a has one -> a is lower  (return -1)
    //   only b has one -> b is lower  (return 1)
    // Two prereleases that both exist are compared in the NEXT lesson; leave that case for now.
checkpoint: A version carrying a prerelease now ranks below the same version without one. Commit and stop here.
---

A prerelease is, by definition, a build that comes *before* a release: `1.0.0-rc.1`
is a candidate for `1.0.0` that has not shipped yet. So SemVer ranks it **lower**:
a version with a prerelease has lower precedence than the otherwise-identical
version without one. `1.0.0-alpha` is less than `1.0.0`. This rule only comes into
play once the numeric cores are equal - the core always decides first, which is
why `1.0.1-alpha` still beats `1.0.0` outright.

Today add just the **presence** check: after the core comparison comes out equal,
a version that has a prerelease loses to one that does not, and if neither has a
prerelease they are equal. Deliberately leave the harder case - two versions that
*both* carry a prerelease, like `1.0.0-alpha` versus `1.0.0-beta` - for the next
lesson, where you compare the identifiers themselves. Splitting it this way keeps
each lesson to one idea: today is "a prerelease exists, and that lowers you"; next
is "given two prereleases, which is lower."
