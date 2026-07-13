---
project: build-a-semver-parser
lesson: 2
title: Rejecting a malformed core
overview: A parser is only trustworthy if it says no to garbage. Today you add the SemVer rules for a valid numeric core - exactly three parts, each a non-negative integer with no leading zeros - and return an error when they are broken.
goal: Return an error for a core that has the wrong number of parts, a non-numeric part, or a leading zero.
spec:
  scenario: A malformed core is rejected
  status: failing
  lines:
    - kw: Given
      text: 'malformed version strings'
    - kw: When
      text: 'each is parsed'
    - kw: Then
      text: 'Parse("1.2"), Parse("1.2.3.4"), Parse("1.2.x") and Parse("01.2.3") each return an error'
    - kw: And
      text: 'Parse("1.2.3") and Parse("0.0.0") still succeed, and Parse("1.02.3") returns an error'
code:
  lang: go
  source: |
    // A valid numeric identifier: a single "0", or a non-zero digit followed by more digits.
    // So "0" is ok, "10" is ok, but "01" and "" and "x" are not.
    func validNum(s string) bool { /* ... */ }
    // In Parse: require exactly three parts, each validNum, before converting.
checkpoint: Parse now accepts only a well-formed numeric core and errors on the rest. Commit and stop here.
---

The SemVer spec is strict about the core so that version strings are unambiguous.
There must be **exactly three** dot-separated parts - `1.2` and `1.2.3.4` are not
versions. Each part must be a **non-negative integer**, so `1.2.x` is out. And
crucially, a numeric part may **not have a leading zero**: `01.2.3` and `1.02.3`
are invalid, because allowing them would make `01` and `1` two spellings of the
same release. A lone `0` is fine - it is `0`, not a leading zero.

That leading-zero rule is easy to miss and easy to get subtly wrong, so pin it
now: a valid numeric identifier is either the single character `0` or a non-zero
digit followed by any digits. Everything the rest of the project does assumes the
core is trustworthy, so this small gate earns its place. Return an error rather
than guessing at a fix - a parser that silently repairs input is worse than one
that rejects it.
