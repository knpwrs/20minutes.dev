---
project: build-a-semver-parser
lesson: 11
title: Build metadata is ignored, and equality
overview: Two versions that differ only in build metadata are the same release, so they compare equal. Today you confirm that your compare ignores build entirely and add an Equal helper that reads naturally.
goal: Add Equal on top of Compare and confirm build metadata never changes precedence.
spec:
  scenario: Build metadata does not affect precedence
  status: failing
  lines:
    - kw: Given
      text: 'versions that differ only in build metadata'
    - kw: When
      text: 'they are compared'
    - kw: Then
      text: 'Compare(1.0.0+build.1, 1.0.0+build.2) is 0 and Equal(1.0.0+build.1, 1.0.0+build.2) is true'
    - kw: And
      text: 'Equal(1.0.0, 1.0.0-alpha) is false and Equal(1.2.3, 1.2.3) is true'
code:
  lang: go
  source: |
    // Compare already reads only Major/Minor/Patch and Prerelease - it never touches Build.
    // So versions differing only in build are already equal; today just confirm it and add:
    func Equal(a, b Version) bool { return Compare(a, b) == 0 }
checkpoint: Build metadata is confirmed irrelevant to ordering, and Equal reads cleanly. Commit and stop here.
---

The SemVer spec is explicit: **build metadata must be ignored when determining
version precedence**. Two versions that differ only after the `+` - `1.0.0+build.1`
and `1.0.0+build.2` - are the very same release built two different ways, so they
compare equal. This is exactly why build identifiers were allowed to have leading
zeros back in the parsing chapter: since they never affect ordering, there is no
ambiguity to prevent.

If your `Compare` is written correctly it *already* satisfies this, because it
only ever looks at the core numbers and the prerelease - it has no reason to read
`Build` at all. So today is a confirmation beat with a small addition: prove that
two build-only-different versions compare equal, and wrap the result in an `Equal`
helper (`Compare(a, b) == 0`) that makes intent obvious at call sites and reads
better than a bare `== 0`. Note the contrast the spec draws: build metadata is
invisible to ordering, but a **prerelease is not** - `1.0.0` and `1.0.0-alpha` are
genuinely different releases, so `Equal` on them is false.
