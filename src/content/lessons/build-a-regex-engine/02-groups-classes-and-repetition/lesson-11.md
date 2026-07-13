---
project: build-a-regex-engine
lesson: 11
title: Character classes
overview: A character class matches any one character from a set - `[abc]` is the general form the dot only hinted at. It is the workhorse of real patterns.
goal: Parse `[abc]` into a Class node that matches any single one of the listed characters.
spec:
  scenario: A character class matches any one listed character
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "[abc]"'
    - kw: When
      text: 'Match is called against "xby"'
    - kw: Then
      text: it reports true
    - kw: And
      text: 'Match for "[abc]" against "xyz" reports false'
    - kw: And
      text: 'Match for "gr[ae]y" against "gray" reports true'
code:
  lang: go
  source: |
    type Class struct{ Set map[byte]bool } // the allowed characters

    // Parser: '[' starts a class; collect bytes until ']'.
    // Matcher: like Dot, it consumes exactly one byte - but only if
    // that byte is in the set.
checkpoint: '`[abc]` matches any single character from its set. Commit and stop here.'
---

A **character class** is a set: `[abc]` matches one character that is `a`, `b`, or
`c`. It behaves just like `.` in that it consumes exactly one byte and fails if no
byte remains - the only difference is that `.` accepts everything while a class
accepts a chosen few. That parallel is worth leaning on: your matcher for `Dot` and
your matcher for `Class` are nearly the same code, one with an "any" test and one
with a membership test.

The parsing is the new part. `[` opens the class and `]` closes it, and everything in
between describes the set. Today that is a plain list of characters; the next two
lessons add ranges (`a-z`) and negation (`^`) to the same little sub-parser. Because a
class is a single atom, quantifiers stack on top for free - `[0-9]+` will just work
once ranges land tomorrow.
