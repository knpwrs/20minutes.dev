---
project: build-a-url-parser
lesson: 12
title: The unreserved set and encoding
overview: Encoding is the inverse of decoding - turn a raw string into safe URI text by escaping anything that is not allowed to appear literally. Today you build that encoder around the unreserved character set, the small group that never needs escaping.
goal: Percent-encode a string, leaving unreserved characters literal and escaping everything else.
spec:
  scenario: Encoding a component
  status: failing
  lines:
    - kw: Given
      text: 'the strings "a b", "~-._foo", and "a/b"'
    - kw: When
      text: 'each is percent-encoded'
    - kw: Then
      text: '"a b" becomes "a%20b", "~-._foo" is unchanged, and "a/b" becomes "a%2Fb"'
    - kw: And
      text: 'the character e-acute encodes to "%C3%A9", its two UTF-8 bytes each escaped, using uppercase hex digits'
code:
  lang: go
  source: |
    // unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
    // everything else -> '%' + two UPPERCASE hex digits
    func PercentEncode(s string) string {
      // iterate BYTES, not runes, so multibyte chars escape per-byte
    }
checkpoint: You can encode any string into safe URI text, escaping everything outside the unreserved set. Commit and stop here.
---

RFC 3986 divides characters into groups, and the safest is the **unreserved** set: the letters, the digits, and the four symbols `-`, `.`, `_`, and `~`. These may always appear literally in any component and, importantly, they must *never* be percent-encoded unnecessarily - `~` and `%7E` mean the same thing, and the unencoded form is canonical. Everything outside that set is escaped: encode a string by copying unreserved bytes through and replacing every other byte with `%` and its two-digit hex value.

Two conventions keep the output canonical. Encode uses **uppercase** hex digits (`%2F`, not `%2f`) - both decode identically, but uppercase is the preferred form. And you iterate over **bytes**, not characters: a non-ASCII character like `é` is two UTF-8 bytes (`0xC3 0xA9`), and each becomes its own escape, giving `%C3%A9`. Escaping the reserved characters too - the slash in `a/b` becomes `%2F` - makes this a maximal, safe-everywhere encoder. The next lesson relaxes it, letting certain characters stay literal depending on which component they land in.
