---
project: build-a-semver-parser
lesson: 22
title: The max-satisfying version
overview: A resolver's core question is "which available version best fits this range?" - the highest one that satisfies. Today you build MaxSatisfying over a list of versions.
goal: Return the highest version from a list that satisfies a range, or nothing if none do.
spec:
  scenario: The best match is the highest satisfying version
  status: failing
  lines:
    - kw: Given
      text: 'the list ["1.2.0", "1.2.3", "1.3.0", "2.0.0"]'
    - kw: When
      text: 'MaxSatisfying is called with a range'
    - kw: Then
      text: 'the best match for "^1.2.0" is 1.3.0 and for "~1.2.0" is 1.2.3'
    - kw: And
      text: 'for ">=3.0.0" there is no match, so it reports none'
code:
  lang: go
  source: |
    // Walk the list; keep only versions that Satisfy the range; return the greatest of those
    // by Compare. If none satisfy, return a clear "no match" signal (empty / ok=false).
    func MaxSatisfying(versions []Version, r Range) (Version, bool) { /* ... */ }
checkpoint: You can pick the best-matching version from a list. Commit and stop here.
---

When a package manager resolves a dependency, the real question is not just "does
this version satisfy the range" but "of everything available, which is the **best**
match?" The convention is the **highest** version that satisfies - you want the
newest release that still fits the constraint. `MaxSatisfying` answers exactly
that: filter a list to the versions that satisfy the range, then return the
greatest of them by `Compare`.

The two range flavors show why the answer depends on the constraint, not just the
list. Over `["1.2.0", "1.2.3", "1.3.0", "2.0.0"]`, a caret `^1.2.0` admits
everything below `2.0.0`, so the best match is `1.3.0`; a tilde `~1.2.0` pins the
minor, so the best match is only `1.2.3`. And when nothing satisfies - `>=3.0.0`
against that list - there is no answer at all, so return a clear "none" signal
rather than a bogus version. That empty case is not an error; it is the honest
result a resolver acts on when it reports that no compatible version exists.
