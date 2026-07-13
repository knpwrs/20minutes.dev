---
project: build-a-url-parser
lesson: 17
title: Percent-encoding normalization
overview: A percent-escape that encodes an unreserved character is redundant, and hex digits can be either case, so normalization canonicalizes both. Today you add percent-encoding normalization to Normalize.
goal: Normalize percent-escapes by decoding unreserved ones and uppercasing the rest.
spec:
  scenario: Canonicalizing percent-escapes
  status: failing
  lines:
    - kw: Given
      text: 'the strings "%7Euser" and "a%2fb"'
    - kw: When
      text: 'percent-encoding normalization is applied'
    - kw: Then
      text: '"%7Euser" becomes "~user", because %7E encodes the unreserved tilde'
    - kw: And
      text: '"a%2fb" becomes "a%2Fb", keeping the reserved slash encoded but uppercasing the hex digits'
code:
  lang: go
  source: |
    // for each "%XX": if the byte is unreserved, decode it to
    // the literal char; otherwise keep "%" + UPPERCASE hex.
    func normalizePercent(s string) string { /* walk, rewrite each escape */ }
checkpoint: Normalize now canonicalizes percent-escapes in the path, query, and fragment. Commit and stop here.
---

Two more percent-encoding facts make otherwise-identical URIs look different. First, an unreserved character should never be escaped: `%7E` is a tilde, and since `~` is unreserved, `%7E` and `~` are equivalent - normalization **decodes** these redundant escapes to their literal character. Second, the hex digits are case-insensitive, so `%2f` and `%2F` are the same byte; normalization **uppercases** the digits of any escape it keeps. Together these give every escaped string one canonical spelling.

The rule per escape is a clean fork: read the two hex digits, and if the byte they encode is unreserved, replace the whole triplet with that literal character; otherwise leave it escaped but with uppercase digits. So `%7Euser` becomes `~user`, while `a%2fb` stays `a%2Fb` because a slash is reserved and must remain encoded - only its digit case is fixed. Apply this to the path, query, and fragment, which are the components that carry percent-escapes. Folding it into `Normalize` alongside case folding means a normalized URI has both canonical case and canonical escapes; one more rule and the normalization is complete.
