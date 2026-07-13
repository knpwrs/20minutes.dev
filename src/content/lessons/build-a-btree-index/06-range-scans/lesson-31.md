---
project: build-a-btree-index
lesson: 31
title: Bulk-loading a sorted batch
overview: Building a tree by inserting keys one at a time is wasteful when the data is already sorted. Today you bulk-load a sorted batch bottom-up - pack full leaves, chain them, and build a parent level - producing a compact tree in one pass.
goal: Build a tree from a pre-sorted batch of entries by filling leaves to capacity, linking them, and adding a parent level of separators.
spec:
  scenario: Bottom-up construction from sorted input
  status: failing
  lines:
    - kw: Given
      text: 'a sorted batch [(10,100),(20,200),(30,300),(40,400),(50,500)] and a teaching leaf capacity of 3'
    - kw: When
      text: the tree is bulk-loaded from the batch
    - kw: Then
      text: 'the leaves are packed [10, 20, 30] then [40, 50], chained in order, under an internal root with separator [40]'
    - kw: And
      text: 'Get returns the right value for all five keys and Scan(0, 100) returns them in ascending order'
code:
  lang: go
  source: |
    func BulkLoad(p Pager, batch []Entry) *Tree {
      // 1. slice batch into leaves of up to `capacity` entries; write each,
      //    linking next-leaf ids left to right
      // 2. build a parent level: one separator per leaf after the first
      //    (the leaf's first key), children = the leaf ids
      // 3. if more than one parent, repeat until a single root remains
    }
checkpoint: A sorted batch becomes a compact tree in one bottom-up pass. Commit and stop here.
---

**Bulk loading** exploits data that is already sorted. Instead of inserting keys one
by one - each a full root-to-leaf descent, with splits rippling as leaves fill -
you lay the leaves down directly: fill each to capacity, chain them, then build the
level above by taking one **separator** per leaf (its first key, following the
"separator is the right child's smallest key" rule) and pointing at the leaves as
children. If that parent level has more than one node, you build a level above it
the same way, until a single root remains.

The result is a tree that is compact and, because leaves are packed full, shallower
and denser than the same keys inserted individually would produce. This is how a
database loads an index over an existing table, or rebuilds one after a big import.
It reuses everything you have - the leaf and internal formats, the separator rule,
the leaf chain - assembled top-down instead of grown. With reads, writes, ranges,
and bulk load done, the index is feature-complete in memory; next it moves to a real
file.
