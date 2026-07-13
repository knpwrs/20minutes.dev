---
project: build-a-semver-parser
lesson: 4
title: The optional build metadata
overview: Build metadata after a plus sign records how a build was made without changing which release it is. Today you split it off before the prerelease and complete the full parse of a version that carries everything at once.
goal: Split an optional "+build" off, before the prerelease, and store it as identifiers.
spec:
  scenario: Build metadata is split off, even alongside a prerelease
  status: failing
  lines:
    - kw: Given
      text: 'the version string "1.2.3+build.5"'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'the core is 1.2.3 and Build is the list ["build", "5"] with Prerelease empty'
    - kw: And
      text: 'Parse("1.2.3-beta.1+build.5") gives Major 1, Minor 2, Patch 3, Prerelease ["beta", "1"], and Build ["build", "5"]'
code:
  lang: go
  source: |
    // Order matters: the build metadata is at the FIRST "+", the prerelease at the
    // first "-", and "+" always comes after "-". So cut the build off FIRST, then
    // cut the prerelease off what's left, then parse the core.
    // "1.2.3-beta.1+build.5" -> build "build.5", then prerelease "beta.1", then core "1.2.3"
checkpoint: Parse now handles a version that carries a core, a prerelease, and build metadata together. Commit and stop here.
---

The last optional piece is **build metadata**, introduced by a `+`:
`1.2.3+build.5`, `1.2.3+20130313144700`. It records information about how a build
was produced - a commit hash, a build number, a timestamp - and, unlike the
prerelease, it does **not** affect which release the version is or how versions
compare. Like the prerelease it is a run of dot-separated identifiers, so store it
as a list too.

The subtlety is **order of operations**. In `1.2.3-beta.1+build.5` the `+` comes
after the `-`, so if you split the prerelease off first it would greedily swallow
`+build.5`. Split the **build off first** (everything after the first `+`), then
split the prerelease off what remains (everything after the first `-`), then parse
the core from what is finally left. Get that order right and the full form -
core, prerelease, and build in one string - falls out cleanly. This is the
complete version grammar; every later lesson reads these parts rather than the
raw string.
