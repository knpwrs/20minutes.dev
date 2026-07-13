---
project: build-an-autocomplete-engine
lesson: 16
title: Caching each node's best completion
overview: Scanning a whole subtree on every keystroke is wasteful when you often want just the single top suggestion. Today you cache each node's best completion, updated as terms are added, so the top answer is instant.
goal: Store the highest-ranked completion at each node as terms are added, and return it in constant time.
spec:
  scenario: Each node remembers its best completion
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Add("cab", 2), Add("car", 5), Add("cat", 9)'
    - kw: When
      text: 'Best("ca") is called'
    - kw: Then
      text: 'it returns "cat" (weight 9, the heaviest completion under ca) without scanning the subtree'
    - kw: And
      text: 'Best("z") returns "" (no completion), and with Add("ax", 5), Add("ay", 5) Best("a") returns "ax" (a weight tie breaks to the lexicographically smaller term)'
code:
  lang: go
  source: |
    // node gains: best *Completion  (nil until a completion exists)
    // When Add ends a term, update best on EVERY node along its path, because
    // the term is a completion of each of those prefixes:
    func updateBest(n *node, term string, weight int) {
      cand := Completion{term, weight}
      if n.best == nil || ranks(cand, *n.best) { // higher weight, or tie -> smaller term
        n.best = &cand
      }
    }
    // ranks(a,b): a.Weight > b.Weight || (a.Weight == b.Weight && a.Term < b.Term)
checkpoint: Every node caches its single best completion, returned instantly by Best. Commit and stop here.
---

The completion query so far scans a subtree every single time, but a keystroke
often only needs the *one* strongest suggestion. So precompute it: give each node
a `best` slot and keep it current as terms arrive. When `Add` finishes a term, that
term is a completion of **every** prefix on its path from the root, so you offer it
to each of those nodes' `best` slots; a node keeps it only if it outranks what it
had, using the same weight-then-lexicographic order you defined for ranking.

Now `Best(prefix)` is just `find(prefix).best` - no traversal, no sorting, answered
in the time it takes to walk the prefix. The tie-break still holds: `ax` and `ay`
both weigh 5, so `Best("a")` is `ax`. This is the core idea of fast autocomplete -
push the ranking work into `Add` so reads are cheap - and the next lesson widens
`best` from one completion into a small top list.
