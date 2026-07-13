---
project: build-a-semver-parser
lesson: 18
title: Caret ranges
overview: The caret range is npm's default - it allows anything that keeps the left-most non-zero component fixed. Today you desugar the common case, where the major version is non-zero.
goal: Expand "^1.2.3" into ">=1.2.3 <2.0.0".
spec:
  scenario: A caret range admits compatible updates below the next major
  status: failing
  lines:
    - kw: Given
      text: 'the range "^1.2.3" parsed with ParseRange'
    - kw: When
      text: 'versions are tested'
    - kw: Then
      text: '1.2.3, 1.5.0 and 1.9.9 satisfy it, since it means ">=1.2.3 <2.0.0"'
    - kw: And
      text: '2.0.0 and 1.2.2 do not satisfy it'
code:
  lang: go
  source: |
    // "^MAJOR.MINOR.PATCH" with MAJOR != 0 allows anything up to (but not including) the next major:
    //   lower = >=MAJOR.MINOR.PATCH
    //   upper = <(MAJOR+1).0.0
    // "^1.2.3" -> [ >=1.2.3 , <2.0.0 ]. Handle a leading "^" here; the zero cases come next.
checkpoint: Caret ranges expand into a same-major bound. Commit and stop here.
---

The **caret** range is the default npm applies when you install a package, so it
is the operator you will meet most. Its rule is "allow changes that do not modify
the **left-most non-zero** component." For a normal version whose major is
non-zero, that component is the major, so `^1.2.3` allows any newer version below
the next major: `>=1.2.3 <2.0.0`. This encodes the SemVer promise directly - within
a major version, minor and patch bumps are supposed to be backward compatible, so
caret takes all of them and stops at the major boundary.

Today handle just this common case, `^MAJOR.MINOR.PATCH` with a non-zero major:
lower bound at the version, upper bound at the next major with minor and patch
zeroed. So `1.9.9` satisfies `^1.2.3` but `2.0.0` does not. The phrase "left-most
non-zero component" is doing quiet but crucial work, though - when the major *is*
zero, the component that must stay fixed shifts to the minor or even the patch, and
the bound changes completely. Those zero cases are subtle enough to be their own
lesson, which is next.
