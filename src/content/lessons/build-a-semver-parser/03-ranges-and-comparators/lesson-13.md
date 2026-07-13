---
project: build-a-semver-parser
lesson: 13
title: A single comparator
overview: A range is built from comparators - an operator and a version, like ">=1.2.3". Today you parse one comparator and test whether a version matches it, reusing Compare for the actual work.
goal: Parse one comparator string and decide whether a version matches it.
spec:
  scenario: A comparator matches versions on one side of a bound
  status: failing
  lines:
    - kw: Given
      text: 'a comparator parsed from a string'
    - kw: When
      text: 'versions are tested against it'
    - kw: Then
      text: 'the comparator ">=1.2.3" matches 1.2.3 and 1.5.0 but not 1.0.0, and "<2.0.0" matches 1.9.9 but not 2.0.0'
    - kw: And
      text: 'a bare "1.2.3" means equality: it matches 1.2.3 only, the same as "=1.2.3"'
code:
  lang: go
  source: |
    // A comparator is an operator plus a version.
    type Comparator struct { Op string; V Version }
    // Recognize a leading ">=", "<=", ">", "<", or "=". No operator at all means "=".
    // matches: compare the version to c.V and check the sign against the operator.
    //   ">=" -> Compare(v, c.V) >= 0, "<" -> Compare(v, c.V) < 0, and so on.
    func matches(c Comparator, v Version) bool { /* ... */ }
checkpoint: You can parse and test a single comparator. Commit and stop here.
---

A **range** is a way to say "any version in this neighborhood," and its atom is a
**comparator**: an operator and a version, like `>=1.2.3` or `<2.0.0`. There are
five operators - `>`, `>=`, `<`, `<=`, and `=` - and each one is answered entirely
by the `Compare` you already have. `>=1.2.3` matches a version `v` exactly when
`Compare(v, 1.2.3)` is zero or positive; `<2.0.0` matches when the comparison is
negative. All the version-ordering subtlety lives in `Compare`, so a comparator is
a thin wrapper over it.

Parse a comparator by peeling off a leading operator - check the two-character
`>=` and `<=` before the single-character `>` and `<` so you do not mistake `>=`
for `>` - and parsing the rest as a version. One convention to establish now,
because ranges lean on it constantly: a token with **no operator** is treated as
`=`. So a bare `1.2.3` is the comparator `=1.2.3` and matches only `1.2.3`. That
default is what lets a range like `1.2.3 || >=2.0.0` mix a plain pinned version
with an open-ended bound in the chapters ahead.
