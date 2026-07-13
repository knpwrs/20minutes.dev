---
project: build-a-spell-checker
lesson: 14
title: Swapping two neighbors
overview: The transposition you already reward in edit distance needs a generator too. Today you produce every string formed by swapping one pair of adjacent letters, the edits that recover a "teh"-for-"the" slip.
goal: Generate all strings formed by swapping exactly one pair of adjacent characters.
spec:
  scenario: Every adjacent swap of a word
  status: failing
  lines:
    - kw: Given
      text: 'the word "cat"'
    - kw: When
      text: its single-transposition edits are generated
    - kw: Then
      text: 'the result is exactly ["act", "cta"] (swap 0 and 1, then 1 and 2)'
    - kw: And
      text: 'transposes of a one-letter word "a" is []'
code:
  lang: go
  source: |
    // for each adjacent pair (i, i+1), swap them:
    //   word[:i] + word[i+1] + word[i] + word[i+2:]
    func transposes(word string) []string {
      // one result per adjacent pair, so len(word)-1 in all
    }
checkpoint: You can list every adjacent-swap edit of a word. Commit and stop here.
---

The second edit family mirrors the transposition you taught the distance function:
swapping two **adjacent** letters. `cat` has two adjacent pairs, so it produces two
swaps - `act` and `cta` - and a one-letter word has no pairs at all, so it produces
none. This is the edit that undoes a finger-order slip, the single most common
kind of real typo.

The construction is mechanical: for each index `i`, glue the word back together
with positions `i` and `i+1` exchanged. Like the deletions, almost all of these
are nonsense; the value is that if the user swapped two letters, the corrected word
lives in this short list. Two families down, two to go, and then you combine them.
