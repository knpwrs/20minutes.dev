---
project: build-a-toml-parser
lesson: 7
title: Basic string escapes
overview: 'A basic string can spell characters it cannot contain directly, like a quote or a newline, using backslash escapes. Today you decode the simple escape sequences into the characters they stand for.'
goal: 'Decode the backslash escape sequences of a basic string.'
spec:
  scenario: Simple escapes
  status: failing
  lines:
    - kw: Given
      text: 'a basic string containing backslash escapes'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'the string written "a\tb\nc" holds a, a tab, b, a newline, c; "\"" holds one double quote; and "\\" holds one backslash'
    - kw: And
      text: 'the recognized escapes are \b \t \n \f \r \" \\, and an unknown escape like \x is an error'
code:
  lang: go
  source: |
    // while reading a basic string, on a '\' read the next char:
    //   'b'->0x08  't'->0x09  'n'->0x0A  'f'->0x0C  'r'->0x0D
    //   '"'->0x22  '\\'->0x5C
    //   'u'/'U' -> unicode escape (next lesson)
    //   anything else -> error: invalid escape
checkpoint: 'Basic strings decode the simple escapes. Commit and stop here.'
---

Because a basic string is delimited by double quotes, it cannot hold a literal `"`
or a literal newline directly, so TOML gives it **escape sequences**: a backslash
followed by a letter that stands for another character. The simple ones are `\b`
(backspace), `\t` (tab), `\n` (line feed), `\f` (form feed), `\r` (carriage
return), `\"` (a double quote), and `\\` (a single backslash). Reading a string now
means walking it character by character and, on a backslash, consuming the next
character and emitting what it names.

The escape set is closed: only those sequences (plus the two Unicode escapes in the
next lesson) are legal. A backslash followed by anything else, like `\x`, is not a
valid TOML string and must be reported as an error rather than passed through. Note
the two that trip people up: `\\` produces exactly one backslash, and `\"` produces
one double quote without ending the string. Decoding into the real characters, not
the two-character source, is the whole point.
