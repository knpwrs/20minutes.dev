---
project: build-a-btree-index
lesson: 9
title: The next-leaf link
overview: Leaves form a linked list left to right, and range scans will hop along it. Today you pin the sentinel that means "no sibling" and add cheap accessors that read and patch just the link, without parsing the whole page.
goal: Read and set a leaf's next-leaf link in place, using page id 0 as the "no next leaf" sentinel.
spec:
  scenario: Reading and patching the next-leaf link
  status: failing
  lines:
    - kw: Given
      text: 'a serialized leaf whose next-leaf link is 0'
    - kw: When
      text: leafNext reads the link from the page
    - kw: Then
      text: 'it returns 0, meaning this leaf has no right sibling (the rightmost leaf)'
    - kw: And
      text: 'after setLeafNext(page, 8) patches the link in place, leafNext returns 8 and every other byte of the page is unchanged'
code:
  lang: go
  source: |
    // page id 0 is reserved (the meta page lives there on disk),
    // so 0 is a safe sentinel for "no next leaf".
    func leafNext(b []byte) PageID       { return PageID(getU32(b, 3)) }
    func setLeafNext(b []byte, id PageID) { putU32(b, 3, uint32(id)) }
checkpoint: Leaves can name and re-point their right sibling cheaply. Commit and stop here.
---

The leaves of a B+Tree are chained into a **singly linked list** by the next-leaf
link, so an ordered scan can start at one leaf and walk rightward through every key
without climbing back up the tree. The rightmost leaf has no sibling, and you need
a value that means exactly that: page id **0**. Since page 0 is reserved for the
meta page once the tree lives in a file, no real leaf ever has id 0, which makes it
a safe **sentinel**.

Reading and patching the link on its own - without a full parse and reserialize -
matters because splits and merges only need to re-point the link, not rewrite the
node. When a leaf splits, its old next-link has to move to the new right leaf and
the old leaf must point at the new one; being able to touch just those four bytes
keeps that surgery simple and leaves the rest of the page untouched.
