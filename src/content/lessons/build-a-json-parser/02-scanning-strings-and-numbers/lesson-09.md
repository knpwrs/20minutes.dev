---
project: build-a-json-parser
lesson: 9
title: Surrogate pairs
overview: Characters above U+FFFF are written as two backslash-u escapes that must be combined into one character. Today you join a surrogate pair into a single rune, and reject a lone surrogate that cannot stand on its own.
goal: Combine a high and low surrogate escape into one code point, and reject an unpaired surrogate.
spec:
  scenario: Combining a surrogate pair
  status: failing
  lines:
    - kw: Given
      text: 'a quoted string containing two backslash-u escapes'
    - kw: When
      text: it is scanned
    - kw: Then
      text: 'backslash-u-D-8-3-4 followed by backslash-u-D-D-1-E decodes to the single character 𝄞 (U+1D11E), which is 4 bytes of UTF-8'
    - kw: And
      text: 'a high surrogate not followed by a low surrogate (like backslash-u-D-8-3-4 then a quote) is Illegal, and a lone low surrogate backslash-u-D-D-1-E is Illegal'
code:
  lang: go
  source: |
    // a \u escape in 0xD800..0xDBFF is a HIGH surrogate; it must be
    // immediately followed by another \u escape in 0xDC00..0xDFFF (LOW).
    // combine: r = 0x10000 + (hi-0xD800)*0x400 + (lo-0xDC00)
    // a high with no valid low following, or a lone low, is Illegal.
checkpoint: Surrogate pairs combine into one rune and lone surrogates are rejected. Commit and stop here.
---

A single `\u` escape can only name code points up to `0xFFFF`. Characters beyond
that - emoji, rarer symbols like the musical G clef `𝄞` (U+1D11E) - are written as a
**surrogate pair**: two `\u` escapes, a **high surrogate** in the range
`0xD800..0xDBFF` immediately followed by a **low surrogate** in `0xDC00..0xDFFF`.
The scanner must combine them into one code point with the formula
`0x10000 + (hi - 0xD800) * 0x400 + (lo - 0xDC00)` and append that single rune.

Surrogates are only meaningful in pairs. A high surrogate with nothing valid after
it, or a low surrogate appearing on its own, does not name a real character - it is
malformed and becomes an Illegal token. Pin both failing edges: a high surrogate
followed by a closing quote, and a lone low surrogate, are each rejected. This is
one of the classic places real parsers disagree, so getting the pairing and its
rejection exactly right matters.
