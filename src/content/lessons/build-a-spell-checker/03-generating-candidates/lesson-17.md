---
project: build-a-spell-checker
lesson: 17
title: One edit away
overview: The four families overlap - a deletion and a replacement can land on the same string. Today you union them into one deduplicated set of every distinct string exactly one edit from a word.
goal: Combine the four edit families into a single set with duplicates removed.
spec:
  scenario: All distinct one-edit strings of a word
  status: failing
  lines:
    - kw: Given
      text: 'the word "a" over the 26-letter lowercase alphabet'
    - kw: When
      text: 'edits1("a") is computed'
    - kw: Then
      text: 'it has exactly 77 distinct members: the empty string, the 25 replacements b through z, and 51 two-letter insertions'
    - kw: And
      text: 'it contains "aa" exactly once (inserting "a" before or after "a" gives the same string), and never contains "a" itself'
code:
  lang: go
  source: |
    func edits1(word string) map[string]bool {
      // union deletes + transposes + replaces + inserts into a set
      // the set collapses the duplicates the four families produce
    }
checkpoint: You can produce the deduplicated set of all one-edit strings. Commit and stop here.
---

Run all four generators on a word and you get every string one edit away - but with
**duplicates**. Inserting `a` before the `a` in `"a"` and inserting it after both
produce `aa`; a substitution and an insertion can coincide on longer words. Since
what you actually want is the *set* of candidates, you union the four lists into a
set, which collapses those repeats automatically.

The counts make the overlap concrete. For the single letter `a`: one deletion (the
empty string), no transpositions, 25 substitutions, and 52 insertions that dedupe
to 51 (because `aa` appears twice) - `1 + 25 + 51 = 77` distinct strings. The
original word is never among them, because every family produces a genuine edit.
This set, `edits1`, is the raw material; the next lesson keeps only the members that
are real words.
