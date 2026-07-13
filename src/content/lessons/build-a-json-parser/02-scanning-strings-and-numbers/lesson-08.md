---
project: build-a-json-parser
lesson: 8
title: Unicode escapes in the basic plane
overview: JSON can spell any character by its code point using a backslash-u escape and four hex digits. Today you decode those escapes for the basic multilingual plane, turning the hex into the real character.
goal: Decode a four-hex-digit backslash-u escape into its Unicode character.
spec:
  scenario: Decoding a \u escape
  status: failing
  lines:
    - kw: Given
      text: 'a quoted string containing a backslash-u escape'
    - kw: When
      text: it is scanned
    - kw: Then
      text: 'backslash-u-0-0-4-1 decodes to the character A, and backslash-u-0-0-e-9 decodes to é (U+00E9)'
    - kw: And
      text: 'the four hex digits are case-insensitive, and fewer than four hex digits (like backslash-u-1-2 then a quote) is an Illegal token'
code:
  lang: go
  source: |
    // on '\u', read exactly the next 4 bytes as hex -> a rune value r
    //   parse each of the 4 as a hex nibble (0-9, a-f, A-F)
    // append r encoded as UTF-8 (a rune may be several bytes)
    // if fewer than 4 hex digits are available, emit an Illegal token
checkpoint: Backslash-u escapes decode to their characters. Commit and stop here.
---

The eight simple escapes cover common controls, but any other character - an
accented letter, a symbol, a non-Latin script - is written with a **Unicode
escape**: `\u` followed by exactly four hexadecimal digits naming a code point.
`A` is `A` (code point 65), and `é` is `é`. The hex digits accept either
case, so `é` and `é` are the same character.

Decoding means reading those four digits into a number and then appending the
**character**, not the digits. Because a code point above `0x7F` is more than one
UTF-8 byte, append the rune through your language's UTF-8 encoding rather than a
single byte. This lesson covers the **basic multilingual plane** - code points that
fit in one `\u` escape (up to `0xFFFF`). Characters above that need two escapes
working together, which is the next lesson. If four hex digits are not there, the
escape is malformed and the scanner emits an Illegal token.
