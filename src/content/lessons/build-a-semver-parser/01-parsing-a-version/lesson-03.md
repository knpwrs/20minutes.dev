---
project: build-a-semver-parser
lesson: 3
title: The optional prerelease
overview: A prerelease version like 1.2.3-alpha.1 marks an unstable build ahead of a release. Today you split that trailing prerelease off the core and store it as its dot-separated identifiers.
goal: Split an optional "-prerelease" off the core and store it as a list of identifiers.
spec:
  scenario: A prerelease is split into identifiers
  status: failing
  lines:
    - kw: Given
      text: 'the version string "1.2.3-alpha.1"'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'the core is Major 1, Minor 2, Patch 3 and Prerelease is the list ["alpha", "1"]'
    - kw: And
      text: 'Parse("1.2.3") leaves Prerelease empty'
code:
  lang: go
  source: |
    // The prerelease starts at the FIRST "-" after the core, and runs to the end.
    // Split it off, then split the prerelease text on "." into identifiers.
    // e.g. "1.2.3-alpha.1" -> core "1.2.3", prerelease ["alpha", "1"]
    // Leave the identifiers as-is today; validating them is a later lesson.
checkpoint: Parse now captures an optional prerelease as a list of identifiers. Commit and stop here.
---

After the numeric core, a version may carry a **prerelease** tag introduced by a
hyphen: `1.2.3-alpha`, `1.2.3-alpha.1`, `1.2.3-rc.2`. It signals a build that
comes *before* the `1.2.3` release and is not yet considered stable. The
prerelease is a series of dot-separated **identifiers** - `alpha.1` is two
identifiers, `alpha` and `1` - and later those identifiers drive the trickiest
part of version ordering, so store them as a list from the start, not as one
blob.

Splitting is straightforward: the prerelease begins at the first `-` after the
core and runs to the end of the string, then splits on `.` into identifiers. Do
not validate them yet - `1.2.3-alpha.1` and even something odd like `1.2.3-01`
should both split cleanly today; the identifier rules come in a couple of lessons.
One thing to leave room for: a version can *also* carry build metadata after a
`+`, which is why we say the prerelease runs to the end "for now" - the next
lesson carves the build part off first.
