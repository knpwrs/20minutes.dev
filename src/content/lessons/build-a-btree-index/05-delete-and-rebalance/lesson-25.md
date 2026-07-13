---
project: build-a-btree-index
lesson: 25
title: Merging two leaves
overview: When an underflowed leaf has no sibling to borrow from, it merges with one. Today you combine two leaves into a single node, drop the now-unneeded separator from the parent, and mend the leaf chain.
goal: Merge an underflowed leaf with an adjacent sibling, removing the separator from the parent and fixing the next-leaf link.
spec:
  scenario: Merging a leaf that cannot borrow
  status: failing
  lines:
    - kw: Given
      text: 'an order-3 tree, root [20, 40], with leaves A = [10], B = [20], C = [40, 50]'
    - kw: When
      text: 'Delete(10) underflows A and its only spare-less sibling is B, so A and B merge'
    - kw: Then
      text: 'A and B become one leaf [20], the separator 20 is removed from the parent (root becomes [40] with two children), and the merged leaf''s next-leaf link points at C'
    - kw: And
      text: 'Get(20), Get(40), and Get(50) still return their values while Get(10) reports not found'
code:
  lang: go
  source: |
    // merge right sibling into left: append all of R's entries to L,
    //   set L.Next = R.Next, free R's page, and remove the separator
    //   (and R's child pointer) from the parent.
    // a leaf merge DROPS the separator - leaves already hold every key.
checkpoint: Two leaves merge into one and the parent loses the separator. Commit and stop here.
---

When neither neighbor can lend, two adjacent leaves **merge** back into one. All of
the right leaf's entries append onto the left, the right leaf's page is freed, and
the parent drops both the separator between them and the pointer to the now-gone
right child. For a **leaf** merge the separator is simply **discarded**, because
leaves already hold every key - the separator was only a signpost, and with one
leaf where there were two it is redundant.

Mending the leaf chain is the easy-to-forget step: the surviving leaf must inherit
the merged-away leaf's next-leaf link, or a range scan will run off the end of the
chain. Merging removes a key and a child from the parent, which can push the
**parent** below its own minimum - so a merge, unlike a borrow, can cascade upward.
Handling an underflowing internal node, where the separator is pulled *down* rather
than dropped, is the next lesson.
