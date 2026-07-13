---
project: build-a-semver-parser
lesson: 1
title: The version value and its numeric core
overview: A semantic version is not a string, it is a structured value - a major, minor, and patch number plus optional prerelease and build parts. Today you define that value and parse the numeric core out of a clean version string.
goal: Parse a well-formed "MAJOR.MINOR.PATCH" string into a Version with its three numbers filled in.
spec:
  scenario: The numeric core parses into three numbers
  status: failing
  lines:
    - kw: Given
      text: 'the version string "1.2.3"'
    - kw: When
      text: 'it is parsed with Parse'
    - kw: Then
      text: 'the result has Major 1, Minor 2, Patch 3, and empty Prerelease and Build'
    - kw: And
      text: 'Parse("10.20.30") gives Major 10, Minor 20, Patch 30'
code:
  lang: go
  source: |
    // Front-load the WHOLE shape now; the last two fields stay empty for a few lessons.
    type Version struct {
      Major, Minor, Patch int
      Prerelease []string // dot-separated identifiers, empty when absent
      Build      []string // dot-separated identifiers, empty when absent
    }
    // Split on ".", convert each of the three parts to an int. Assume a clean input today.
    func Parse(s string) (Version, error) { /* ... */ }
checkpoint: You can turn a clean version string into a Version with its core numbers. Commit and stop here.
---

Semantic Versioning gives a release a three-number name: `MAJOR.MINOR.PATCH`,
like `1.2.3`. **Major** changes when you break compatibility, **minor** when you
add features, **patch** when you fix bugs. Everything this library does - ordering
versions, matching ranges - starts by pulling those three numbers out of a string
and holding them as a real value instead of text.

Define the `Version` value with all five of its fields today even though only the
first three get filled in: the optional `Prerelease` and `Build` parts arrive in
the next few lessons, and giving the value its final shape now means later lessons
only add parsing, never reshape the type. Keep today honest and small - assume the
input is a clean `MAJOR.MINOR.PATCH` with no prerelease, no build, and no
malformed parts. Rejecting bad input is tomorrow's job.
