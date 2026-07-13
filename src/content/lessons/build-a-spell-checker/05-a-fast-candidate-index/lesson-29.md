---
project: build-a-spell-checker
lesson: 29
title: Indexing the whole dictionary
overview: Now put the tree to work on the real dictionary. Today you build a BK-tree from every word the dictionary holds and prove its radius search returns exactly what the brute-force oracle does, while visiting only a fraction of the words.
goal: Build a BK-tree over the dictionary and confirm its radius search equals the Nearby oracle, touching fewer nodes than a full scan.
spec:
  scenario: The index agrees with the oracle, but faster
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary of "world", "word", "ward", "cord", "cat", "dog", "house", "mouse", indexed into a BK-tree'
    - kw: When
      text: 'the index is searched for words within 2 edits of "wrld"'
    - kw: Then
      text: 'it returns ["ward", "word", "world"], identical to Nearby("wrld", 2)'
    - kw: And
      text: 'the search visits fewer than Size() nodes (it prunes at least one branch), while its result set matches the oracle for every query tried'
code:
  lang: go
  source: |
    func (d *Dictionary) BuildIndex() {
      // insert every dictionary word into a BKNode root
    }
    func (d *Dictionary) IndexNearby(word string, max int) []string {
      // root.Within(word, max) - must equal Nearby(word, max)
    }
    // add a visited-node counter to Within to prove pruning happened
checkpoint: The dictionary's BK-tree matches the oracle while pruning the search. Commit and stop here.
---

The tree is only useful if it holds the **whole dictionary**, so `BuildIndex`
inserts every word into a single BK-tree rooted at the first one. The moment of
truth is correctness: `IndexNearby(word, max)` must return exactly what the
brute-force `Nearby(word, max)` returns - same words, same set - because a fast
index that gives *different* answers is just a bug. For `wrld` at distance 2, both
return `ward`, `word`, and `world`.

The difference is cost. Instrument `Within` with a **visited-node counter** and you
can see the pruning bite: the search touches only the nodes whose edges kept them in
the band, skipping the rest. On this small dictionary it is a few nodes fewer; on a
100,000-word list it is the difference between a full scan and a near-instant lookup.
This is the honest justification for the whole structure - proven equivalent to the
oracle, demonstrably cheaper - and the next lessons make the corrector use it.
