---
project: build-a-btree-index
lesson: 15
title: Delete from a leaf
overview: The last operation the single-node index needs is removal. Today you delete a key from the root leaf, closing the gap so the entries stay sorted and packed - rebalancing across nodes comes later.
goal: Remove a key and its value from the root leaf, keeping the remaining entries sorted, and report whether it was there.
spec:
  scenario: Deleting a key from the leaf
  status: failing
  lines:
    - kw: Given
      text: 'a tree holding keys [10, 20, 30]'
    - kw: When
      text: 'Delete(20) is called'
    - kw: Then
      text: 'it returns true and the root leaf holds keys [10, 30] with their values, still sorted'
    - kw: And
      text: 'Delete(99) returns false and leaves the leaf unchanged'
code:
  lang: go
  source: |
    func (t *Tree) Delete(key uint64) bool {
      leaf := parseLeaf(t.pager.ReadPage(t.root))
      i, found := searchLeaf(leaf.Keys, key)
      if !found { return false }
      // remove entry i from Keys and Vals (shift the rest left)
      t.pager.WritePage(t.root, serializeLeaf(leaf))
      return true
    }
checkpoint: The single-node index supports Put, Get, and Delete. Commit and stop here.
---

`Delete` finds the key with the same binary search, then **removes** its entry and
closes the gap by shifting the later entries left, keeping the leaf sorted and
packed. A miss changes nothing and returns `false`, so callers can tell a real
deletion from a no-op.

While the whole tree is one leaf, deletion is this simple - there is no parent to
notify and no sibling to rebalance against. The root leaf is even allowed to shrink
to empty, because the root is special: it never underflows. That freedom ends once
the tree has more than one node, where a leaf that drops too low has to borrow from
or merge with a neighbor - the subject of the delete-and-rebalance chapter. First,
the next chapter makes the tree grow past a single leaf at all.
