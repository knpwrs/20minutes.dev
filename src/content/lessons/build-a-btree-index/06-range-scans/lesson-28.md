---
project: build-a-btree-index
lesson: 28
title: Scanning a range
overview: The payoff of keeping keys sorted with linked leaves is a fast range query. Today you scan a half-open range [lo, hi) - descend to the start leaf, then walk the leaf chain collecting keys until you pass the upper bound.
goal: Return every key/value with lo <= key < hi, in sorted order, by finding the start leaf and following next-leaf links.
spec:
  scenario: A half-open range query
  status: failing
  lines:
    - kw: Given
      text: 'a tree holding keys 10, 20, 30, 40, 50 (spread across several leaves)'
    - kw: When
      text: 'Scan(20, 50) is called'
    - kw: Then
      text: 'it returns keys 20, 30, 40 in sorted order - 50 is excluded because the upper bound is exclusive'
    - kw: And
      text: 'Scan(15, 25) returns just [20], and Scan(0, 100) returns all five keys in order'
code:
  lang: go
  source: |
    func (t *Tree) Scan(lo, hi uint64) []Entry {
      id := t.findLeaf(lo)               // start leaf (may be page 0!)
      for {                              // process this leaf first...
        leaf := parseLeaf(t.pager.ReadPage(id))
        // append entries with key >= lo and key < hi;
        // if any key >= hi, return now
        if leaf.Next == 0 { break }      // 0 forward-link = end of chain
        id = leaf.Next                   // ...then follow the chain
      }
    }
checkpoint: The index answers ordered range queries across leaves. Commit and stop here.
---

A **range scan** is where the B+Tree earns its shape. Descending finds the leaf
where `lo` would live, and from there the answer is already laid out in order along
the **leaf chain** - no more tree traversal needed, just a walk rightward through
the next-leaf links, gathering entries. Because every leaf points at its successor,
the scan flows across leaf boundaries without ever climbing back up.

The bound is **half-open**: `lo` is included, `hi` is excluded, matching the usual
convention so adjacent ranges like `[0, 50)` and `[50, 100)` tile without overlap.
The scan stops as soon as it meets a key at or past `hi`, so it never reads more
leaves than it must. This is the operation that separates a B+Tree from a plain hash
index: ordered data plus linked leaves makes "every key between these two" nearly
free.
