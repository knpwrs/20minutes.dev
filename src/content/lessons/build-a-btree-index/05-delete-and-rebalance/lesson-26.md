---
project: build-a-btree-index
lesson: 26
title: Merging internal nodes
overview: A merge can leave the parent internal node too empty to stand, and internal nodes merge with a twist - the separator is pulled down into the merged node. Today you handle an underflowing internal node so a merge cascades correctly up the tree.
goal: When a merge underflows an internal node, merge it with a sibling by pulling the parent's separator down into the combined node.
spec:
  scenario: An internal merge pulls the separator down
  status: failing
  lines:
    - kw: Given
      text: 'an order-3 tree, root [40, 80], whose child P = [20] over leaves [10] and [20] underflows after Delete(10) merges its leaves, and P''s sibling Q = [60] over leaves [40, 50] and [60, 70] has no spare'
    - kw: When
      text: 'P and Q merge'
    - kw: Then
      text: 'the parent separator 40 (between P and Q) is pulled down, so the merged node has keys [40, 60] and three leaf children, and the root becomes [80]'
    - kw: And
      text: 'Get returns the right value for every surviving key (20, 40, 50, 60, 70, and the keys under 80), the tree stays 3 levels tall, and all leaves remain at the same depth'
code:
  lang: go
  source: |
    // internal merge (right sibling into left): the merged node's keys are
    //   L.Keys ++ [parentSeparator] ++ R.Keys   (separator pulled DOWN)
    //   and its children are L.Children ++ R.Children.
    // then remove that separator and R's pointer from the parent, which
    //   may itself underflow -> recurse the same repair upward.
checkpoint: Internal nodes merge by pulling the separator down, and the repair cascades up. Commit and stop here.
---

An internal node underflows when a merge below it removes one of its keys and it
drops under the minimum. It repairs the same two ways a leaf does - borrow or merge -
but merging is where the shapes diverge. A **leaf** merge drops the separator; an
**internal** merge **pulls it down**. The separator between the two nodes is a real
boundary key that is not stored in any leaf, so it must become the middle key of the
merged node, sitting between the two nodes' child pointers, or the key space would
develop a gap.

So the merged internal node is left keys, then the pulled-down separator, then right
keys, with all the children concatenated in order - the exact inverse of the
`splitInternal` promotion. Removing that separator from the parent can underflow the
parent in turn, so the repair **recurses upward**, borrowing or merging at each
level until it reaches a node that is still legal. The one place it can run out of
tree entirely is the root, which is where the last delete lesson comes in.
