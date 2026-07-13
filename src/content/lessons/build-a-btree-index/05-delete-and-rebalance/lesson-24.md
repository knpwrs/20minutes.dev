---
project: build-a-btree-index
lesson: 24
title: Borrowing from a sibling
overview: When a leaf underflows but a neighbor has a key to spare, the fix is to borrow one and slide the parent's separator to match. Today you redistribute a key from a sibling, pinning both the borrow-from-left and borrow-from-right cases.
goal: Repair an underflowed leaf by borrowing a key from an adjacent sibling that has more than the minimum, updating the parent separator.
spec:
  scenario: Redistributing a key from a sibling
  status: failing
  lines:
    - kw: Given
      text: 'an order-3 tree, root [20], with leaves L = [10] and R = [20, 30]'
    - kw: When
      text: 'Delete(10) underflows L, so it borrows from its right sibling R'
    - kw: Then
      text: 'R''s first key 20 moves to L, and the parent separator updates to R''s new first key 30, giving L = [20], R = [30], root [30]'
    - kw: And
      text: 'the mirror case - root [20], L = [10, 15], R = [20]; Delete(20) borrows from the left - gives R = [15], L = [10], and parent separator 15'
code:
  lang: go
  source: |
    // right sibling has a spare (> minKeys): move R.Keys[0]/Vals[0] to
    //   the end of L, then set parent separator = R.Keys[0] (new first).
    // left sibling has a spare: move L's LAST entry to the front of R,
    //   then set parent separator = the moved key (R's new first).
    const minKeys = maxKeys / 2 // = 1 for order 3
checkpoint: An underflowed leaf repairs itself by borrowing when a sibling can spare a key. Commit and stop here.
---

The cheaper of the two repairs is **borrowing**, also called redistribution. When a
leaf underflows and an adjacent sibling has more than the minimum, one entry moves
across the boundary to rebalance them, and - this is the part that is easy to miss -
the **parent separator has to move with it**. The separator always names the first
key of the right-hand leaf, so after keys shift, it must be reset to whatever now
sits at the front of the right leaf.

Both directions follow the same principle but touch different ends. Borrowing from
the **right** takes that sibling's smallest key and appends it to the underflowed
leaf; borrowing from the **left** takes that sibling's largest key and prepends it.
Either way the separator is refreshed to the right leaf's new first key. Borrowing
only works when a neighbor can actually spare a key; when both neighbors are at the
minimum, there is nothing to lend, and the leaves have to **merge** instead - the
next lesson.
