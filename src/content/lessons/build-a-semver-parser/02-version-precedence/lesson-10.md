---
project: build-a-semver-parser
lesson: 10
title: The tiebreak and the full chain
overview: When two prereleases agree on every identifier they share, the one with more identifiers wins. Adding that last rule completes precedence, so today you also reproduce the exact prerelease chain from the SemVer spec.
goal: Break a tie between prereleases by identifier count, and order the whole SemVer example chain.
spec:
  scenario: More identifiers wins the tie, completing the spec chain
  status: failing
  lines:
    - kw: Given
      text: 'prereleases where one is a prefix of the other'
    - kw: When
      text: 'they are compared'
    - kw: Then
      text: 'Compare(1.0.0-alpha, 1.0.0-alpha.1) is -1, because with every shared identifier equal the larger set has higher precedence'
    - kw: And
      text: 'sorting the eight versions puts them in exactly this order: 1.0.0-alpha, 1.0.0-alpha.1, 1.0.0-alpha.beta, 1.0.0-beta, 1.0.0-beta.2, 1.0.0-beta.11, 1.0.0-rc.1, 1.0.0'
code:
  lang: go
  source: |
    // After walking the shared positions with no difference, compare LENGTHS:
    //   fewer identifiers -> lower precedence (return -1)
    //   more identifiers  -> higher precedence (return 1)
    //   equal length      -> the prereleases are equal (0)
    // "alpha" vs "alpha.1": all shared positions equal, alpha is shorter, so alpha is lower.
checkpoint: Precedence is complete and reproduces the SemVer spec's prerelease chain. Commit and stop here.
---

There is one case left from the last lesson: two prereleases where the shorter is
a prefix of the longer, like `alpha` and `alpha.1`. Every identifier they share is
equal, so the tiebreak is **length** - a larger set of prerelease identifiers has
*higher* precedence, provided all the preceding ones are equal. So `alpha` is
lower than `alpha.1`. With that rule added, `Compare` implements the entire SemVer
precedence definition: core by significance, then presence of a prerelease, then
identifiers left to right, then length.

The payoff is the worked example straight out of clause 11 of the spec. These
eight versions have a single, exact order:
`1.0.0-alpha` < `1.0.0-alpha.1` < `1.0.0-alpha.beta` < `1.0.0-beta` <
`1.0.0-beta.2` < `1.0.0-beta.11` < `1.0.0-rc.1` < `1.0.0`. Every rule you have
built shows up in it: `alpha` before `alpha.1` is the length tiebreak, `alpha.1`
before `alpha.beta` is numeric-below-alphanumeric, `beta.2` before `beta.11` is
numeric ordering, and `rc.1` before `1.0.0` is prerelease-below-release. If your
`Compare` sorts this chain correctly, precedence is done.
