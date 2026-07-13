---
project: build-a-regex-engine
lesson: 15
title: Escaping metacharacters
overview: A backslash before a metacharacter strips its power - `a\.c` matches a real dot, not any character. This is how a pattern matches the very symbols regex uses for syntax.
goal: Parse a backslash followed by a metacharacter into a Literal for that character.
spec:
  scenario: A backslash turns a metacharacter into a literal
  status: failing
  lines:
    - kw: Given
      text: 'the pattern ''a\.c'''
    - kw: When
      text: 'Match is called against "a.c"'
    - kw: Then
      text: 'it reports true, and ''a\.c'' against "axc" reports false'
    - kw: And
      text: 'Match for ''a\*b'' against "a*b" reports true'
    - kw: And
      text: 'Match for ''a\*b'' against "aaab" reports false'
code:
  lang: go
  source: |
    // Extend the backslash branch from yesterday. After a '\':
    //   d, w, s      -> the shorthand classes
    //   anything else -> a Literal of that exact byte
    // So '\.', '\*', '\(', '\\' all become plain characters.
checkpoint: A backslash escapes metacharacters into literals. Commit and stop here.
---

Regex needs an escape hatch: how do you match a literal `.` when `.` means "any
character"? You **escape** it. A backslash followed by a metacharacter - `\.`, `\*`,
`\(`, `\\` - produces a `Literal` of that exact byte, with no special meaning. Now a
pattern can match the punctuation that regex itself is built from.

This extends the same backslash branch you opened yesterday for `\d`, `\w`, `\s`. The
rule is simple: after a `\`, a handful of letters mean shorthand classes, and
everything else means "the next byte, taken literally". That single dispatch point -
look at the character after the backslash - now covers both jobs. With escaping in
place, the only quantifier left is the counted kind, `{n}`, which the last two lessons
of the chapter add.
