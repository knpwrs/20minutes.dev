---
project: build-an-autocomplete-engine
lesson: 17
title: A cached top list per node
overview: A suggestion box wants several options, not one, so today you widen each node's cache from its single best completion into a small ranked top list, still maintained as terms are added.
goal: Cache a bounded, ranked top list of completions at each node, kept current on every Add.
spec:
  scenario: Each node caches a bounded ranked top list
  status: failing
  lines:
    - kw: Given
      text: 'a cache capacity of 5 and a trie with Add("cab", 2), Add("car", 5), Add("card", 7), Add("care", 3), Add("cat", 9)'
    - kw: When
      text: 'the cache on the ca node is inspected'
    - kw: Then
      text: 'it holds exactly [{cat,9}, {card,7}, {car,5}, {care,3}, {cab,2}] in ranked order'
    - kw: And
      text: 'the cache on the car node holds exactly [{card,7}, {car,5}, {care,3}], and Best(prefix) still returns the first cached term'
code:
  lang: go
  source: |
    const cacheCap = 5 // keep at most this many per node
    // node gains: cache []Completion  (replaces best; Best returns cache[0].Term)
    func updateCache(n *node, term string, weight int) {
      out := n.cache[:0]
      for _, c := range n.cache { // drop any stale entry for this term
        if c.Term != term { out = append(out, c) }
      }
      out = append(out, Completion{term, weight})
      sort.Slice(out, func(i, j int) bool { return ranks(out[i], out[j]) })
      if len(out) > cacheCap { out = out[:cacheCap] }
      n.cache = out
    }
checkpoint: Every node caches a bounded ranked list of its top completions. Commit and stop here.
---

One suggestion is rarely enough, so widen the cache: replace each node's single
`best` with a `cache` slice holding its top few completions in ranked order,
capped at a fixed capacity (`cacheCap`). `Add` maintains it the same way - for
each node on the term's path, drop any stale entry for that term, insert the new
one, re-rank, and trim back to the cap. `Best` becomes a one-liner over
`cache[0]`, so the previous lesson's guarantee still holds.

Dropping a stale entry before inserting is what makes this survive a term being
**re-added** with a new weight (and, soon, a selection bumping it): without it the
cache would hold two rows for the same term. Capping at `cacheCap` keeps every
node's memory bounded no matter how large its subtree - the cache is a fast lane
for the common small request, and the next lesson wires the ranked query to read
from it, falling back to a full scan only when a caller asks for more than the cap.
