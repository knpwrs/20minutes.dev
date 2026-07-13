---
project: build-a-toml-parser
lesson: 9
title: Literal strings
overview: 'Sometimes you want the characters exactly as written, backslashes and all. Today you parse a literal string, the single-quoted form, which does no escaping at all.'
goal: 'Parse a single-quoted literal string with no escape processing.'
spec:
  scenario: A single-quoted literal string
  status: failing
  lines:
    - kw: Given
      text: 'the pair path written with single quotes as C:\Users\name'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'the value for path is the exact text C:\Users\name, with every backslash kept'
    - kw: And
      text: 'no escape is processed, so the literal string holding backslash-t is two characters, a backslash then a t, and a literal string cannot contain a single quote'
code:
  lang: go
  source: |
    // parseValue: a leading '\'' starts a literal string
    //   read every character up to the next '\'' verbatim
    //   NO escape handling - a backslash is just a backslash
    // the value is exactly the characters between the single quotes
checkpoint: 'Single-quoted literal strings keep every character verbatim. Commit and stop here.'
---

A **literal string** is written in single quotes and does the opposite of a basic
string: **no escaping happens at all**. Every character between the single quotes is
taken exactly as written, so `'C:\Users\name'` is that path with its backslashes
intact, and `'\t'` is the two characters backslash and `t`, not a tab. This is what
makes literal strings the right tool for Windows paths and regular expressions,
where backslashes are everywhere and escaping them would be noise.

The rule is simple precisely because there are no special cases inside: read from
the opening single quote to the next single quote and keep everything between them.
The trade-off is that a literal string **cannot contain a single quote** - there is
no escape to smuggle one in - so the first `'` you meet ends the string. That
limitation is what the multiline literal form, a couple of lessons ahead, relaxes.
Today, one flat rule: copy the characters through untouched.
