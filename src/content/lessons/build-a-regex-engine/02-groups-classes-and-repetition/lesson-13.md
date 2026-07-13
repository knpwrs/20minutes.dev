---
project: build-a-regex-engine
lesson: 13
title: Negated character classes
overview: A leading `^` inside a class inverts it - `[^abc]` matches any character except the listed ones. It reuses the class you already have, flipped.
goal: Parse `[^...]` into a negated class that matches any single character not in its set.
spec:
  scenario: A negated class matches any character not listed
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "[^abc]"'
    - kw: When
      text: 'Match is called against "abx"'
    - kw: Then
      text: it reports true
    - kw: And
      text: 'Match for "[^abc]" against "abc" reports false'
    - kw: And
      text: 'Match for "[^0-9]" against "007" reports false, and against "12a34" reports true'
code:
  lang: go
  source: |
    type Class struct {
        Set    map[byte]bool
        Negate bool
    }

    // A '^' immediately after '[' sets Negate. Ranges and literals
    // fill Set exactly as before; only the membership test flips:
    // matches one byte when (byte in Set) != Negate.
checkpoint: '`[^...]` matches any character except those listed. Commit and stop here.'
---

Negation flips a class inside out: `[^abc]` matches any single character that is
**not** `a`, `b`, or `c`. Notice the `^` here is unrelated to the start-of-text
anchor - context is everything in regex, and just inside a `[` it means "invert".
Only the very first character position counts; a `^` anywhere else in the class is a
literal caret.

The elegant part is how little changes. You build the set of listed characters
exactly as before - literals and ranges alike - and only the final membership test
flips: a negated class matches when the byte is *absent* from the set. A negated
class still consumes exactly one byte and still fails at end of text, so quantifiers
keep working on top of it. Tomorrow the shorthands `\d`, `\w`, `\s` reuse this same
`Class` node.
