---
project: build-a-semver-parser
lesson: 9
title: Comparing prerelease identifiers
overview: When two versions both carry a prerelease, you compare their identifiers one at a time. Today you add the three-part rule for a single pair of identifiers - numbers compared as numbers, text compared alphabetically, and a number always lower than text.
goal: Compare two prereleases identifier by identifier until one differs.
spec:
  scenario: Prerelease identifiers compare by type and value
  status: failing
  lines:
    - kw: Given
      text: 'two versions that share a core and both have a prerelease'
    - kw: When
      text: 'they are compared'
    - kw: Then
      text: 'Compare(1.0.0-alpha, 1.0.0-beta) is -1 and Compare(1.0.0-beta.2, 1.0.0-beta.11) is -1'
    - kw: And
      text: 'Compare(1.0.0-1, 1.0.0-alpha) is -1 because a numeric identifier is always lower than an alphanumeric one, and Compare(1.0.0-beta.2, 1.0.0-beta.2) is 0'
code:
  lang: go
  source: |
    // Walk both identifier lists together, position by position. For each pair:
    //   both all-digits: compare NUMERICALLY (so "2" < "11").
    //   both have letters: compare as text, ASCII order (so "alpha" < "beta").
    //   one numeric, one not: the NUMERIC one is lower, always.
    // Return at the first position that differs. (Lists of different length: next lesson.)
checkpoint: You can order two prereleases by walking their identifiers. Commit and stop here.
---

Two prereleases are compared **identifier by identifier**, left to right, until a
pair differs - just like comparing `beta.2` against `beta.11`. Each pair of
identifiers follows three rules. If **both are numeric** (all digits), compare
them as numbers, so `2` is less than `11` even though as text `"11"` sorts first.
If **both are alphanumeric**, compare them as text in ASCII order, so `alpha` is
less than `beta`. And when **one is numeric and the other is not**, the numeric
one is always the lower of the two - `1` ranks below `alpha`.

That last rule is the one people forget, and it is why comparing as plain strings
gives wrong answers: numbers are a distinct, lower class of identifier. Walk the
two lists together and return as soon as a position disagrees. Today, keep to
lists you can compare position by position; what happens when one prerelease has
*more* identifiers than the other - `alpha` versus `alpha.1` - is a separate
tiebreak you will add next, along with the full chain that ties all of these
rules together.
