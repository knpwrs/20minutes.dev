---
project: build-a-spell-checker
lesson: 20
title: Counting words
overview: When several real words sit the same distance from a typo, the tie-breaker is which word is more common. Today you turn the word set into a frequency count so the dictionary knows not just that a word exists, but how often it appears.
goal: Track how many times each word has been added, keeping membership working as before.
spec:
  scenario: Counting occurrences of each word
  status: failing
  lines:
    - kw: Given
      text: an empty dictionary
    - kw: When
      text: 'Add("the") is called twice and Add("cat") once'
    - kw: Then
      text: 'Count("the") is 2, Count("cat") is 1, and Count("missing") is 0'
    - kw: And
      text: 'Contains("the") is still true and Size() is still 2'
code:
  lang: go
  source: |
    // replace the set with a count map; membership is "count > 0"
    type Dictionary struct { counts map[string]int }
    func (d *Dictionary) Add(word string) {
      d.counts[normalize(word)]++
    }
    func (d *Dictionary) Count(word string) int { /* 0 if absent */ }
    func (d *Dictionary) Contains(word string) bool { /* count > 0 */ }
checkpoint: The dictionary now counts word occurrences while membership still works. Commit and stop here.
---

Two real words can be equally close to a typo - `teh` is one edit from both `the`
and `tea` - so distance alone cannot pick a winner. The tie-breaker that works
astonishingly well is **frequency**: `the` is one of the most common words in
English and `tea` is not, so `the` is the better guess. To use that signal, the
dictionary has to *count*, not just remember.

The change is quietly structural: swap the set of words for a **map from word to
count**, and derive membership from it (`Contains` is just "count greater than
zero"). Everything built on `Contains` and `Size` keeps working unchanged, because
a counted word is still a present word. What is new is `Count`, the raw frequency
that the ranking in this chapter is built on. Norvig calls this the language model:
a simple estimate of how likely each word is, learned by counting.
