---
project: build-a-btree-index
lesson: 13
title: Put into a non-full leaf
overview: Now the index accepts data. Today you insert a key and value into the root leaf, keeping the entries sorted and overwriting a value when the key already exists - the first real mutation the tree can perform.
goal: Insert a key/value into the root leaf in sorted order, overwriting the value if the key is already present.
spec:
  scenario: Inserting keeps the leaf sorted
  status: failing
  lines:
    - kw: Given
      text: a new tree (empty root leaf)
    - kw: When
      text: 'Put(20, 200), then Put(10, 100), then Put(30, 300) are called'
    - kw: Then
      text: 'the root leaf holds keys [10, 20, 30] with values [100, 200, 300] in sorted order (insertion order does not matter)'
    - kw: And
      text: 'a later Put(20, 999) overwrites in place - the value at key 20 becomes 999 and the key count stays 3'
code:
  lang: go
  source: |
    func (t *Tree) Put(key, val uint64) {
      leaf := parseLeaf(t.pager.ReadPage(t.root))
      i, found := searchLeaf(leaf.Keys, key)
      // found: leaf.Vals[i] = val
      // else: insert key at i and val at i (shift the rest right)
      t.pager.WritePage(t.root, serializeLeaf(leaf))
    }
checkpoint: The tree stores keys in sorted order and overwrites duplicates. Commit and stop here.
---

`Put` uses the search from the last lesson twice over. If the key is **found**, the
value is overwritten in place - a B+Tree stores each key once, so a repeat `Put` is
an update, not a second entry. If the key is **missing**, the search hands back the
insertion point, and the new key and value are spliced in there, shifting the later
entries right to keep everything sorted.

Today the leaf can always absorb the insert because the tree only holds a handful
of keys - the order-3 leaf has room. That happy path is deliberate: keeping keys
sorted on the way in is one idea, and handling a **full** leaf that has to split is
a whole chapter of its own. For now the index genuinely works - you can put keys
and, next lesson, get them back.
