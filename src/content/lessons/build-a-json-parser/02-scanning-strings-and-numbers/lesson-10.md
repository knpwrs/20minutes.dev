---
project: build-a-json-parser
lesson: 10
title: Rejecting control characters and bad escapes
overview: A well-formed string has limits - raw control characters are forbidden inside it, and only the known escapes are allowed. Today you make the scanner reject both, so malformed strings are caught at their exact position.
goal: Report a raw control character or an unknown escape inside a string as an Illegal token.
spec:
  scenario: String content that is not allowed
  status: failing
  lines:
    - kw: Given
      text: 'a quoted string'
    - kw: When
      text: it is scanned
    - kw: Then
      text: 'a raw line feed byte between the quotes is an Illegal token at the offset of that byte'
    - kw: And
      text: 'an unknown escape like backslash-q is an Illegal token, while every byte 0x20 and above (except quote and backslash) is allowed literally'
code:
  lang: go
  source: |
    // inside the string loop, before accepting a literal byte:
    //   if b < 0x20 { Illegal: "control character in string" }
    // when decoding an escape, the default case (not one of the 8
    // simple escapes or 'u') is Illegal: "invalid escape"
checkpoint: Strings reject raw control characters and unknown escapes. Commit and stop here.
---

JSON forbids raw **control characters** - any byte below `0x20` - from appearing
literally inside a string. A newline in the middle of a string has to be written
`\n`; a raw newline byte is an error. This is what makes a string a single-line
token and lets a missing closing quote be detected instead of silently swallowing
the rest of the document. Likewise, the backslash may only introduce one of the
escapes you already handle; anything else, like `\q`, is not a defined escape.

Both failures produce an **Illegal token** at the position of the offending byte,
the same mechanism a bad keyword used. Everything else - every byte `0x20` and above
that is not an unescaped quote or backslash - passes through as literal content,
including multi-byte UTF-8 for characters written directly rather than as escapes.
With this, the string scanner both decodes valid strings and rejects the malformed
ones at an exact spot.
