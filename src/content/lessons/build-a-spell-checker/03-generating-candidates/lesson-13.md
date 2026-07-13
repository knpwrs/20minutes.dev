---
project: build-a-spell-checker
lesson: 13
title: Deleting one letter
overview: Scanning the whole dictionary for close words is slow. The faster idea is to work from the typo instead - generate the strings a few edits away and see which are real. Today you build the first edit family, every string one deletion away.
goal: Generate all strings formed by deleting exactly one character from a word.
spec:
  scenario: Every single-character deletion of a word
  status: failing
  lines:
    - kw: Given
      text: 'the word "cat"'
    - kw: When
      text: its single-deletion edits are generated
    - kw: Then
      text: 'the result is exactly ["at", "ct", "ca"] (delete position 0, 1, then 2)'
    - kw: And
      text: 'deletes of a one-letter word "a" is [""] and deletes of "" is []'
code:
  lang: go
  source: |
    // for each position i, drop the character at i:
    //   word[:i] + word[i+1:]
    func deletes(word string) []string {
      // one result per position, left to right
    }
checkpoint: You can list every one-deletion edit of a word. Commit and stop here.
---

The brute-force `Nearby` scan measures a typo against every word in the dictionary,
which does not scale. Peter Norvig's insight flips it around: instead of asking the
dictionary "who is near me?", generate the strings that are near the **typo** and
ask "which of you are real?" There are only a few of those per word, and the number
does not grow with the dictionary. This chapter builds that generator, one **edit
operation** at a time, starting with the simplest.

A **deletion** removes one character. For an `n`-letter word there are exactly `n`
of them - drop position 0, then 1, and so on - so `cat` yields `at`, `ct`, `ca`.
Most of these are gibberish and will be thrown away; that is fine. The point is
that the real corrections for a single-deletion typo (someone typed `ct` for `cat`)
are guaranteed to be somewhere in this small list, found without touching the
dictionary at all.
