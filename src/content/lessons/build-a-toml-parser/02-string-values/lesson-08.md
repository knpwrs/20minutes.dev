---
project: build-a-toml-parser
lesson: 8
title: Unicode escapes
overview: 'Any character can be written by its code point using a Unicode escape. Today you decode the four-digit and eight-digit forms, turning the hex into the real character.'
goal: 'Decode \uXXXX and \UXXXXXXXX Unicode escapes into their characters.'
spec:
  scenario: Unicode escapes
  status: failing
  lines:
    - kw: Given
      text: 'a basic string containing a Unicode escape'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'the escape backslash-u-0-0-E-9 decodes to é (code point U+00E9), and the escape backslash-U-0-0-0-1-F-6-0-0 decodes to the emoji at U+1F600'
    - kw: And
      text: 'the hex digits are case-insensitive, and an escape with too few hex digits is an error'
code:
  lang: go
  source: |
    // on '\u' read exactly 4 hex digits; on '\U' read exactly 8
    //   parse them as a code point (rune); hex is case-insensitive
    //   append the rune encoded as UTF-8 (may be several bytes)
    // fewer digits than required, or a non-hex digit -> error
checkpoint: 'Unicode escapes decode to their characters. Commit and stop here.'
---

Beyond the simple escapes, any character at all can be written by its **code
point**. TOML has two forms: `\u` followed by exactly four hex digits for code
points up to `U+FFFF`, and `\U` followed by exactly eight hex digits for the full
Unicode range. So `é` is `é` and `\U0001F600` is the grinning-face emoji. The
hex digits accept either case, so `é` and `é` are the same character.

Decoding means reading the fixed number of hex digits into a number and appending
the **character** it names, not the digits themselves. Because most code points
encode to more than one byte in UTF-8, append the value through your language's
rune-to-UTF-8 encoding rather than as a single byte. The digit count is exact: `\u`
demands four and `\U` demands eight, so an escape that runs short, or contains a
non-hex character, is malformed and must be reported as an error.
