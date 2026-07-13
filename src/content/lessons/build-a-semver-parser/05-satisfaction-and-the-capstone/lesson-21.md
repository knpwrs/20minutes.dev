---
project: build-a-semver-parser
lesson: 21
title: The prerelease satisfaction rule
overview: Prereleases are deliberately hard to match by accident - a plain range never admits them. Today you add the node-semver rule that only lets a prerelease satisfy a set that opts in at the same version.
goal: Admit a prerelease into a comparator set only when the set has a prerelease comparator at the same core.
spec:
  scenario: A prerelease satisfies a set only when the set opts in
  status: failing
  lines:
    - kw: Given
      text: 'ranges tested against a prerelease version'
    - kw: When
      text: 'satisfaction is checked'
    - kw: Then
      text: '1.2.3-beta.1 does NOT satisfy ">=1.0.0", even though 1.2.3-beta.1 is greater than 1.0.0'
    - kw: And
      text: '1.2.3-beta.1 DOES satisfy ">=1.2.3-alpha", and an ordinary release 1.5.0 still satisfies ">=1.0.0"'
code:
  lang: go
  source: |
    // Extra gate inside a set, applied only when the tested version HAS a prerelease:
    //   the set must contain at least one comparator whose version has a prerelease
    //   AND the same [major, minor, patch] as the tested version.
    // If no such comparator exists, the prerelease version fails the set (even if every
    // comparator's ordering check passed). Ordinary releases are unaffected.
checkpoint: Prerelease versions only satisfy ranges that explicitly opt in. Commit and stop here.
---

There is a trap in naive range matching: `1.2.3-beta.1` is greater than `1.0.0` by
precedence, so a plain `>=1.0.0` would seem to admit it - but that is almost never
what you want. Prereleases are unstable and easy to pull in by accident, so
node-semver adds a guard: a version **with a prerelease** may satisfy a comparator
set only if the set contains a comparator that *itself* has a prerelease **at the
same major, minor, and patch**. In other words, you only get prereleases of
`1.2.3` if you explicitly asked for a prerelease of `1.2.3` somewhere in the set.

So `1.2.3-beta.1` fails `>=1.0.0` - no comparator opts into prereleases at `1.2.3`
- but satisfies `>=1.2.3-alpha`, because that comparator is a prerelease at the
same `1.2.3` core and `beta.1` outranks `alpha`. Ordinary releases are completely
unaffected: `1.5.0` still satisfies `>=1.0.0` as always. Implement it as an extra
check applied only when the tested version has a prerelease: after the normal
"every comparator matches" test, require that the set contains a prerelease
comparator at the same core, or reject. This is the rule that keeps `npm install`
from silently handing you a beta.
