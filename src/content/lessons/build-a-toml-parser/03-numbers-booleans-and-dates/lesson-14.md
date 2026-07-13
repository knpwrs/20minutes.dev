---
project: build-a-toml-parser
lesson: 14
title: Hex, octal, and binary integers
overview: 'Integers can be written in other bases. Today you parse the three prefixed forms, hexadecimal, octal, and binary, so config can express masks and permissions naturally.'
goal: 'Parse 0x, 0o, and 0b prefixed integers into their decimal values.'
spec:
  scenario: Non-decimal integer bases
  status: failing
  lines:
    - kw: Given
      text: 'prefixed integer values'
    - kw: When
      text: 'they are parsed'
    - kw: Then
      text: '0xDEAD is the integer 57005, 0o755 is 493, and 0b1010 is 10'
    - kw: And
      text: 'the hex digits are case-insensitive and underscores are allowed between digits, so 0xdead_beef is 3735928559; a prefixed form never takes a sign'
code:
  lang: go
  source: |
    // after the bare token is read, check a two-char prefix:
    //   "0x" -> base 16   "0o" -> base 8   "0b" -> base 2
    // strip the prefix and inter-digit underscores, then parse in that base
    // no leading sign is allowed on a prefixed integer
checkpoint: 'Hex, octal, and binary integers parse to their values. Commit and stop here.'
---

Beyond base ten, TOML writes integers in three other bases with a two-character
prefix: `0x` for **hexadecimal**, `0o` for **octal**, and `0b` for **binary**. So a
color mask is `0xDEAD` (which is 57005 in decimal), a Unix file mode is `0o755`
(493), and a small bit pattern is `0b1010` (10). These prefixes make intent obvious
where a plain decimal would obscure it.

Parsing is the decimal path with a twist: recognize the prefix, then interpret the
remaining digits in that base. Hex digits are **case-insensitive**, so `0xDEAD` and
`0xdead` are equal, and underscores between digits are still allowed for grouping
(`0xdead_beef` is 3735928559). One difference from decimal: a prefixed integer
**never carries a sign** - there is no `-0x1` - because these forms are about bit
patterns, not signed magnitudes. Detecting the prefix and switching base is the
whole job.
