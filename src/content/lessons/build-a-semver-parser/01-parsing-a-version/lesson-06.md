---
project: build-a-semver-parser
lesson: 6
title: Printing a version back
overview: A parsed version should be able to render itself back to its canonical string. Today you write that String method and prove it round-trips, which closes the parsing chapter with something you can see.
goal: Reconstruct the canonical version string from a parsed Version.
spec:
  scenario: A version round-trips through parse and print
  status: failing
  lines:
    - kw: Given
      text: 'a Version parsed from "1.2.3-beta.1+build.5"'
    - kw: When
      text: 'its String method is called'
    - kw: Then
      text: 'it returns "1.2.3-beta.1+build.5"'
    - kw: And
      text: 'String on Parse("1.2.3") returns "1.2.3" and on Parse("1.2.3+001") returns "1.2.3+001"'
code:
  lang: go
  source: |
    // Always "MAJOR.MINOR.PATCH". Append "-" + join(Prerelease, ".") only if there IS one.
    // Append "+" + join(Build, ".") only if there IS build metadata.
    func (v Version) String() string { /* ... */ }
checkpoint: A parsed version can print itself back to a canonical string. The parsing chapter is done; commit and stop here.
---

Now that a version is a structured value, it should be able to turn back into a
string - the inverse of `Parse`. The canonical form is fixed: the three numbers
joined by dots, then a `-` and the dot-joined prerelease identifiers **only if a
prerelease is present**, then a `+` and the dot-joined build identifiers **only
if build metadata is present**. Omit the delimiter entirely when its part is
empty, so `1.2.3` prints as `1.2.3`, not `1.2.3-+`.

This gives the whole chapter a satisfying close: because both sides use the same
canonical grammar, parsing a valid version and printing it back reproduces the
original string exactly. That round-trip is a genuine correctness check - if the
printed form differs from the input, something in the parse dropped or reordered a
part. It is also the first piece of the library that produces visible output, and
you will lean on it later when a range prints the comparators it expands into.
