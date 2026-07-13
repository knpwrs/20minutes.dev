---
project: build-a-semver-parser
lesson: 24
title: 'Capstone: a resolver in miniature'
overview: The finale runs a small package-resolver workload against everything you built - sort a set of versions including prereleases, answer satisfy questions across every range form, and pick the best match. Each layer proves itself at once.
goal: Run a mixed workload of sorting, satisfaction, and selection, asserting every exact result.
spec:
  scenario: A full workload sorts, tests, and selects correctly
  status: failing
  lines:
    - kw: Given
      text: 'the versions ["2.0.0", "1.2.0", "1.0.0-beta.11", "1.2.3", "1.0.0", "1.0.0-alpha", "1.3.0", "1.0.0-rc.1"] and the installed list ["1.2.0", "1.2.3", "1.3.0", "2.0.0"]'
    - kw: When
      text: 'the versions are sorted and the ranges are evaluated'
    - kw: Then
      text: 'the sort is 1.0.0-alpha, 1.0.0-beta.11, 1.0.0-rc.1, 1.0.0, 1.2.0, 1.2.3, 1.3.0, 2.0.0; MaxSatisfying(installed, "^1.2.0") is 1.3.0 and MaxSatisfying(installed, "~1.2.0") is 1.2.3'
    - kw: And
      text: '1.5.0 satisfies "^1.2.3" but 2.0.0 does not, 0.3.0 does not satisfy "^0.2.3", 1.9.0 satisfies "1.x", and 1.2.3-beta.1 does NOT satisfy "1.x"'
code:
  lang: go
  source: |
    // Everything composes with no new code:
    //   Sort(versions)                       -> the full precedence order (prereleases first)
    //   MaxSatisfying(installed, "^1.2.0")    -> 1.3.0
    //   MaxSatisfying(installed, "~1.2.0")    -> 1.2.3
    //   Satisfies(1.5.0, "^1.2.3")            -> true ; Satisfies(2.0.0, "^1.2.3") -> false
    //   Satisfies(1.2.3-beta.1, "1.x")        -> false (no prerelease comparator opts in)
checkpoint: Your SemVer library runs a full resolver workload and every answer is exact. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real **Semantic
Versioning library**, exercised the way a package manager uses it. The workload
touches every layer at once. Sorting the eight versions runs the full precedence
engine, and the prereleases land first in their exact spec order before the
releases - `1.0.0-alpha`, `1.0.0-beta.11`, `1.0.0-rc.1`, then `1.0.0` and the rest.
`MaxSatisfying` over the installed list answers the resolver's real question, and
caret versus tilde pick different best matches from the same set.

The satisfaction checks close the loop across the range grammar: caret bounds
(`1.5.0` in, `2.0.0` out of `^1.2.3`), the zero-major tightening (`0.3.0` out of
`^0.2.3`), a wildcard (`1.9.0` in `1.x`), and the prerelease guard doing its job -
`1.2.3-beta.1` is rejected by `1.x` because no comparator opted into prereleases.
Every one of these is a single call into code you already wrote; the capstone adds
no new logic, it just proves the parts agree. From a version string in to a precise
answer out, you have built the honest core of the tool every dependency you install
runs through - and it is yours.
