---
project: build-a-semver-parser
lesson: 5
title: Validating the identifiers
overview: Prerelease and build identifiers have their own rules, and they differ in one important way. Today you enforce them - non-empty, correct character set, and no leading zeros on numeric prerelease identifiers, but leading zeros allowed in build metadata.
goal: Reject empty or badly-formed identifiers, and forbid leading zeros only in numeric prerelease identifiers.
spec:
  scenario: Identifier rules are enforced, and differ for prerelease and build
  status: failing
  lines:
    - kw: Given
      text: 'versions with prerelease or build identifiers'
    - kw: When
      text: 'each is parsed'
    - kw: Then
      text: 'Parse("1.2.3-01"), Parse("1.2.3-beta.01"), Parse("1.2.3-beta_1") and Parse("1.2.3-") each return an error'
    - kw: And
      text: 'Parse("1.2.3+001"), Parse("1.2.3-0") and Parse("1.2.3-alpha01") each succeed'
code:
  lang: go
  source: |
    // Every identifier: non-empty, only [0-9A-Za-z-].
    // A prerelease identifier that is ALL digits is a numeric identifier: no leading zero
    // (so "01" is bad, "0" is fine). "alpha01" is alphanumeric, not numeric, so it is fine.
    // Build identifiers skip the leading-zero rule entirely: "001" is a valid build id.
    func validIdent(s string, prerelease bool) bool { /* ... */ }
checkpoint: Parse now rejects malformed identifiers while allowing leading zeros in build metadata. Commit and stop here.
---

Identifiers are not arbitrary text. Every identifier - prerelease or build - must
be **non-empty** and made only of ASCII alphanumerics and hyphens (`[0-9A-Za-z-]`),
so `1.2.3-beta_1` is invalid (underscore) and `1.2.3-` and `1.2.3-a..b` are
invalid (empty identifier). The rule that trips people up is about **numeric**
identifiers: a prerelease identifier that is entirely digits may not have a
leading zero, so `1.2.3-01` and `1.2.3-beta.01` are invalid while `1.2.3-0` is
fine. An identifier with a letter in it, like `alpha01`, is alphanumeric rather
than numeric, so the leading-zero rule does not apply.

Here is the asymmetry worth pinning: **build metadata ignores the leading-zero
rule**. Build identifiers can be all digits with leading zeros - `1.2.3+001` is
perfectly valid - because build metadata never participates in ordering, so `001`
and `1` being distinguishable does no harm. So the same "is this all digits, and
does it start with zero" check that rejects a prerelease identifier must let a
build identifier through. One small flag on your validation function captures the
whole difference.
