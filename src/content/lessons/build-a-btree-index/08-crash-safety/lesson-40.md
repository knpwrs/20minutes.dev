---
project: build-a-btree-index
lesson: 40
title: Copy-on-write down the path
overview: A single COW page is not enough - the parent still points at the old page. Today you copy the whole root-to-leaf path, so an insert produces an entirely new root that coexists with the old one, without overwriting a single live page.
goal: Perform an insert by copying every page from the leaf up to the root, producing a new root id and leaving the old tree fully readable.
spec:
  scenario: A write builds a new root beside the old one
  status: failing
  lines:
    - kw: Given
      text: 'a two-level tree with root R over leaves, and a remembered copy of the old root id'
    - kw: When
      text: 'a copy-on-write Put inserts a key, copying the touched leaf and then the root onto new pages'
    - kw: Then
      text: 'reading the tree through the NEW root id shows the inserted key, while reading through the OLD root id still shows the pre-insert tree'
    - kw: And
      text: 'no page reachable from the old root was overwritten - the two roots share the untouched subtrees and differ only along the copied path'
code:
  lang: go
  source: |
    // insert now returns the child's NEW page id up the path:
    //   leaf:     cowPage(leaf, add key) -> newLeafID
    //   internal: recurse; then cowPage(this, set child = newChildID) -> newID
    // Put: newRoot := insert(t.root, ...); t.root = newRoot
    // the old root and every page it reaches remain valid and unchanged.
checkpoint: An insert produces a whole new root; the old tree is still readable. Commit and stop here.
---

Copying one page is not enough, because its parent still points at the **old** page.
So copy-on-write ripples up: after copying the leaf, you copy its parent onto a new
page with its child pointer swung to the new leaf, then that parent's parent, all
the way to a **new root**. Only the pages along the touched path are copied;
everything off the path is shared, still pointed at by both the old and new roots.

The striking consequence is that the old root remains a complete, valid tree - the
state exactly as of before this write. Two roots now coexist, sharing all the
subtrees the write did not touch. This is **snapshot isolation** falling out of the
design for free, and, more to the point here, it is what makes a write **atomic**:
the new tree exists entirely in new pages, invisible until something records the new
root as official. Recording that root - the commit - is the next few lessons, and
it is where fsync ordering and the double meta page come in.

One gotcha copy-on-write introduces: because the touched leaf lands on a **new page
id**, its **left neighbor's** next-leaf link still points at the leaf's **old** id,
so the leaf chain is now broken to the left. Point lookups do not notice (they route
by separator key, never by the chain), but a range scan does. So a COW insert must
also re-point the predecessor leaf's next-link at the new page - and since that
predecessor is itself a live page, re-pointing it is another copy-on-write, which
cascades left leaf by leaf. That is the price of pairing copy-on-write immutability
with physical leaf pointers, and it is why a scan-after-COW test is worth writing:
it is exactly the case the happy-path point-lookup lessons never exercise.
