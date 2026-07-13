---
project: build-an-autocomplete-engine
lesson: 20
title: Learning from a selection
overview: Autocomplete should get better as it is used - a term someone picks should rank higher next time. Today you add Record, which bumps a term's weight and re-ranks it through the caches.
goal: Bump a chosen term's weight so a later query ranks it higher, updating the caches along its path.
spec:
  scenario: Recording a selection lifts a term in the ranking
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Add("car", 7) and Add("cat", 5), where Suggest("ca", 2) returns ["car", "cat"]'
    - kw: When
      text: 'Record("cat") is called three times'
    - kw: Then
      text: 'Weight("cat") is 8 and Suggest("ca", 2) now returns ["cat", "car"] - the selected term has overtaken the previously heavier one'
    - kw: And
      text: 'the change is visible through the cache, not just a rescan, because Record updates every node on the term''s path'
code:
  lang: go
  source: |
    func (t *Trie) Record(term string) {
      cur := t.root
      path := []*node{cur}
      for _, r := range term {
        // walk, creating children as needed (see lesson 21 for a new term)
        cur = cur.children[r]
        path = append(path, cur)
      }
      cur.weight++ // one selection = one point
      for _, n := range path {
        updateCache(n, term, cur.weight) // re-rank every prefix on the path
      }
    }
checkpoint: Recording a selection bumps a term's weight and re-ranks it everywhere. Commit and stop here.
---

An engine that learns is what separates autocomplete from a static dictionary.
`Record(term)` is how a selection feeds back: the term the user chose gains a
point of weight, so it drifts up the rankings for every prefix it completes. `car`
starts ahead of `cat` at 7 to 5, but three selections of `cat` take it to 8 and it
overtakes - exactly the behaviour a good suggestion box has, surfacing what you
actually pick.

The important part is that the bump must reach the **caches**, or the fast query
would keep serving stale rankings. Because `Record` walks the term's whole path,
it can call the same `updateCache` that `Add` uses on each node, re-ranking the
term within every prefix's cached top list. That reuse is why the cache-maintenance
work from the last chapter was worth it: learning is just another weight change
flowing through the same machinery.
