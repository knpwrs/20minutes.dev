---
project: build-a-semver-parser
lesson: 19
title: Caret with leading zeros
overview: When the major version is zero, the caret's "left-most non-zero component" moves inward, and the bound tightens. Today you handle the 0.x and 0.0.x cases that make caret genuinely tricky.
goal: Expand "^0.2.3" into ">=0.2.3 <0.3.0" and "^0.0.3" into ">=0.0.3 <0.0.4".
spec:
  scenario: A caret over a zero-major version tightens the upper bound
  status: failing
  lines:
    - kw: Given
      text: 'the ranges "^0.2.3" and "^0.0.3" parsed with ParseRange'
    - kw: When
      text: 'versions are tested'
    - kw: Then
      text: '0.2.3 and 0.2.9 satisfy "^0.2.3" (it means ">=0.2.3 <0.3.0") but 0.3.0 does not'
    - kw: And
      text: '0.0.3 satisfies "^0.0.3" (it means ">=0.0.3 <0.0.4") but 0.0.4 does not'
code:
  lang: go
  source: |
    // Upper bound bumps whichever is the LEFT-MOST NON-ZERO component:
    //   MAJOR != 0 -> <(MAJOR+1).0.0     (last lesson)
    //   MAJOR == 0, MINOR != 0 -> <0.(MINOR+1).0
    //   MAJOR == 0, MINOR == 0 -> <0.0.(PATCH+1)
    // "^0.2.3" -> [ >=0.2.3 , <0.3.0 ] ; "^0.0.3" -> [ >=0.0.3 , <0.0.4 ]
checkpoint: Caret handles zero-major versions, completing its rule. Commit and stop here.
---

A `0.x` version means "not stable yet," and SemVer treats a leading zero as a
signal that *anything* might change, so caret gets stricter. The rule is still
"do not modify the left-most non-zero component," but when the major is `0` that
component is no longer the major. For `^0.2.3` the left-most non-zero component is
the **minor**, so caret pins the minor and allows only patch changes:
`>=0.2.3 <0.3.0`. For `^0.0.3` even the minor is zero, so the left-most non-zero
component is the **patch**, and caret allows nothing but that exact patch onward
to the next one: `>=0.0.3 <0.0.4`.

This is the case that makes caret worth understanding rather than memorizing. The
same operator that admitted an entire major line for `^1.2.3` admits only a single
patch for `^0.0.3`, purely because of where the first non-zero digit sits. Extend
the caret desugaring with the two zero branches: if the major is zero and the minor
is not, bump the minor; if both are zero, bump the patch. With that, caret is
complete and behaves exactly as every npm-based project depends on it to.
