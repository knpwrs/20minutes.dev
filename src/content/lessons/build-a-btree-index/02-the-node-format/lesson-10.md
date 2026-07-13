---
project: build-a-btree-index
lesson: 10
title: Fanout - how many keys fit a page
overview: A B+Tree is fast because each page holds many keys, so the tree stays shallow. Today you compute the fanout - the maximum keys a leaf and an internal node hold in a 4096-byte page - and set the small teaching order the split lessons will use.
goal: Compute the maximum key count for a leaf and an internal node in a 4096-byte page.
spec:
  scenario: Deriving the fanout from the page size
  status: failing
  lines:
    - kw: Given
      text: 'a page size of 4096 bytes, a leaf header of 7 bytes, a 16-byte entry, an internal header of 3 bytes, an 8-byte key, and a 4-byte child id'
    - kw: When
      text: the leaf and internal capacities are computed
    - kw: Then
      text: 'a leaf holds at most 255 keys: floor((4096 - 7) / 16) = 255'
    - kw: And
      text: 'an internal node holds at most 340 keys: the largest N with 3 + 8*N + 4*(N+1) <= 4096, i.e. floor((4096 - 7) / 12) = 340'
code:
  lang: go
  source: |
    func leafCapacity(pageSize int) int {
      return (pageSize - leafHeader) / entrySize        // 255
    }
    func internalCapacity(pageSize int) int {
      // 3 header + 8*N keys + 4*(N+1) children <= pageSize
      return (pageSize - 3 - 4) / (8 + 4)               // 340
    }
checkpoint: You know the real fanout of a 4096-byte page. Commit and stop here.
---

The whole reason a B+Tree beats a binary tree on disk is **fanout**: because one
4096-byte page holds hundreds of keys, the tree branches hundreds of ways at each
level, so even a million keys sit only three or four pages deep. Today's numbers -
255 keys in a leaf, 340 in an internal node - are the concrete payoff of packing
nodes into fixed pages.

Those are the real limits, but demonstrating a **split** with 255 keys would be
miserable, so from here the tree uses a small teaching **order**: a node holds at
most 3 keys and splits on the 4th. The mechanics are identical at order 3 and order
255 - only the numbers change - so pinning the split rules on tiny nodes is exactly
as correct, and far easier to follow. The next chapter builds a working one-node
index; the chapter after that makes it grow.
