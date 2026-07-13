---
project: build-an-autocomplete-engine
lesson: 11
title: Terms carry a weight
overview: Real autocomplete ranks suggestions by how important they are, so each term needs a weight - a popularity or frequency score. Today you add terms with a weight and read it back.
goal: Store a term together with a weight, and report the weight of any term.
spec:
  scenario: A term remembers its weight
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Add("cat", 9) and Add("car", 5)'
    - kw: When
      text: 'Weight is queried'
    - kw: Then
      text: 'Weight("cat") is 9 and Weight("car") is 5'
    - kw: And
      text: 'Weight("dog") is 0 (never added) and Weight("ca") is 0 (a prefix, not a term); a later Add("cat", 3) changes Weight("cat") to 3 without changing Len()'
code:
  lang: go
  source: |
    func (t *Trie) Add(term string, weight int) {
      cur := t.root
      for _, r := range term {
        // ... walk/create children exactly like Insert ...
      }
      if !cur.end {
        cur.end = true
        t.size++
      }
      cur.weight = weight // set or overwrite this term's score
    }
    func (t *Trie) Weight(term string) int {
      n := t.find(term)
      if n == nil || !n.end {
        return 0
      }
      return n.weight
    }
checkpoint: Terms can be added with a weight, and you can read any term's weight. Commit and stop here.
---

`Add` is `Insert` with one extra line: after ending the word, store its `weight`
on that final node - the field you reserved back in lesson 1. Re-adding an
existing term overwrites its weight but does not touch the count, because the word
was already there. (`Insert` is now just `Add(term, 0)` - a term with no score.)

`Weight` walks to the term and returns its stored score, but only if the node
actually ends a word. A term that was never added, or a bare prefix like `ca`
that no one stored as a word, has no weight to report, so you return `0`. Weights
are the raw material of ranking: the next lessons collect completions *with* their
weights and sort by them, so that the most popular completion comes first.
