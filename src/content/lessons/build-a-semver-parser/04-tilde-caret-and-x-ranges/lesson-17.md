---
project: build-a-semver-parser
lesson: 17
title: Tilde ranges
overview: A tilde range allows patch-level changes but not minor ones - the everyday "bug fixes only" constraint. Today you desugar "~1.2.3" into the bounded set it stands for.
goal: Expand "~1.2.3" into ">=1.2.3 <1.3.0".
spec:
  scenario: A tilde range admits patch updates only
  status: failing
  lines:
    - kw: Given
      text: 'the range "~1.2.3" parsed with ParseRange'
    - kw: When
      text: 'versions are tested'
    - kw: Then
      text: '1.2.3 and 1.2.9 satisfy it, since it means ">=1.2.3 <1.3.0"'
    - kw: And
      text: '1.3.0 and 1.2.2 do not satisfy it'
code:
  lang: go
  source: |
    // "~MAJOR.MINOR.PATCH" allows patch changes, so the upper bound bumps the MINOR:
    //   lower = >=MAJOR.MINOR.PATCH
    //   upper = <MAJOR.(MINOR+1).0
    // "~1.2.3" -> [ >=1.2.3 , <1.3.0 ]. Detect a leading "~" on a token and expand it.
checkpoint: Tilde ranges expand into a patch-level bound. Commit and stop here.
---

The **tilde** range is how you say "take bug fixes, but nothing riskier." When you
write `~1.2.3` with all three numbers present, it allows patch-level changes and
holds the minor version fixed: it expands to `>=1.2.3 <1.3.0`. So `1.2.9` is in but
`1.3.0` is out - a new patch is welcome, a new minor is not. This is the common
choice for a dependency you trust only to fix bugs without adding surface area.

Desugar it just like the hyphen range: spot a leading `~` on a token, then emit a
`>=` at the version itself and a `<` at the next minor with patch reset to zero.
The rule for the upper bound is "increment the minor, zero the patch," which is
what makes the whole `1.2.x` line satisfy the range and nothing in `1.3` do so.
(Tilde has variants for when the patch or minor is omitted - `~1.2` and `~1` - that
widen the bound; the full-form `~1.2.3` is the one to pin here, and the same
"bump one component" idea drives the rest.)
