---
project: build-a-btree-index
lesson: 14
title: Get a key back
overview: An index you can write to but not read is no index. Today you add Get - read the root leaf, binary-search it, and return the value or a clean "not found" - completing the smallest usable key-value index.
goal: Look up a key in the root leaf and return its value, or report that it is missing.
spec:
  scenario: Point lookup in the leaf
  status: failing
  lines:
    - kw: Given
      text: 'a tree holding [10 -> 100, 20 -> 200, 30 -> 300]'
    - kw: When
      text: Get is called
    - kw: Then
      text: 'Get(20) returns value 200, found = true'
    - kw: And
      text: 'Get(25) returns found = false, and Get(5) returns found = false (a missing key is distinct from a stored value)'
code:
  lang: go
  source: |
    func (t *Tree) Get(key uint64) (uint64, bool) {
      leaf := parseLeaf(t.pager.ReadPage(t.root))
      i, found := searchLeaf(leaf.Keys, key)
      if !found { return 0, false }
      return leaf.Vals[i], true
    }
checkpoint: You have a working, importable key-value index - Put and Get over sorted pages. Commit and stop here.
---

`Get` is `Put`'s simpler twin: read the root leaf, binary-search for the key, and
return its value if the search hit or a **not-found** signal if it missed. Just
like the very first pager lesson kept "missing" a distinct answer, `Get` returns a
value plus a found flag so a caller never has to guess whether `0` means "stored
zero" or "not there."

With `Put` and `Get` the tree is, for the first time, a **usable index** - small,
single-node, but real: you can store keys and read them back in sorted order, all
through fixed pages. Every later lesson widens what it can hold (splitting when a
leaf fills, growing taller, spilling to disk) without changing this surface. The
public API you would import is already taking its final shape.
