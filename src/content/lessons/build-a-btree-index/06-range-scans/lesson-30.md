---
project: build-a-btree-index
lesson: 30
title: Leaf links survive splits and merges
overview: The leaf chain is only trustworthy if it stays intact through every structural change. Today you prove it - hammer the tree with inserts and deletes that force splits and merges, then scan and confirm the chain still visits every key exactly once.
goal: After a sequence of inserts and deletes that cause splits and merges, confirm a full scan returns exactly the surviving keys in order.
spec:
  scenario: The chain stays correct under churn
  status: failing
  lines:
    - kw: Given
      text: 'an order-3 tree into which keys 10, 20, 30, 40, 50, 60, 70 are inserted (forcing several splits)'
    - kw: When
      text: '30 and 50 are deleted (forcing a borrow or merge) and then the whole tree is scanned'
    - kw: Then
      text: 'the scan yields exactly 10, 20, 40, 60, 70 in ascending order - no surviving key skipped, none duplicated'
    - kw: And
      text: 'every leaf''s next-leaf link reaches the next leaf in key order, and the last leaf''s link is 0'
code:
  lang: go
  source: |
    // no new production code is expected - this lesson is a test that
    // exercises split and merge together, then walks the cursor/scan and
    // asserts the exact surviving key set in order. if it fails, the bug
    // is a next-leaf link not re-pointed during a split (l16) or merge (l25).
checkpoint: The leaf chain is proven intact through splits and merges. Commit and stop here.
---

This lesson has little or no new code, and that is the point: it is the moment the
leaf-link maintenance from the split and merge lessons gets **proven end to end**.
Individually each operation re-pointed the links correctly; here they run together
under churn, and a single missed link would show up immediately as a scan that skips
a key or loops.

Walking the whole tree after splits and merges and getting back **exactly** the
keys that should survive, in order, is the strongest evidence the chain is sound. A
scan that returns them all is only possible if every split handed its forward link
to the new right leaf and every merge inherited its neighbor's link - the invariants
you built earlier, now holding across a realistic sequence. This confidence is what
lets the on-disk and crash-safety chapters lean on the chain without re-checking it.
