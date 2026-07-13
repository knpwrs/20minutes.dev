---
project: build-a-shell
lesson: 20
title: Character classes and no-match
overview: You finish globbing with `[...]` character classes and the rule for what happens when a pattern matches nothing - which is where shells make a choice that surprises newcomers.
goal: Extend globbing to `[...]` character classes and leave a pattern that matches no files as a literal word.
spec:
  scenario: Classes and unmatched patterns
  status: failing
  lines:
    - kw: Given
      text: 'the current directory contains "a.txt", "b.txt", and "c.txt"'
    - kw: When
      text: 'the word "[ab].txt" is expanded'
    - kw: Then
      text: 'it becomes ["a.txt", "b.txt"]'
    - kw: And
      text: 'a pattern that matches nothing, like "*.zzz", stays the literal word ["*.zzz"]'
code:
  lang: c
  source: |
    // '[abc]' matches one char in the set; '[a-z]' matches a range
    // after globbing, if the match list is empty:
    if (matches == 0) keep_pattern_literal(word);   // no nullglob
checkpoint: Globbing is complete - `[a-c]*.txt` and friends work. Chapter three is done. Commit and stop here.
---

A **character class** `[...]` matches exactly one character from a set: `[ab]`
matches an `a` or a `b`, and a range like `[a-z]` matches any lowercase letter. It
is the third and last wildcard, and it slots into the same matcher as `*` and `?` -
when the matcher hits a `[`, it reads to the closing `]` and checks whether the
current filename character is in the set.

The genuinely surprising rule is what a shell does when a pattern matches **no
files**. Rather than expanding to nothing, the traditional behavior is to leave
the pattern **exactly as typed** - so `ls *.zzz` in a directory with no `.zzz`
files runs `ls` with the literal argument `*.zzz` (and `ls` then complains it
cannot find a file by that odd name). It looks like a quirk, but it is why a
mistyped glob produces a "no such file" error naming the pattern rather than
silently doing nothing. With classes and this rule, your globbing is complete.
