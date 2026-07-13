---
project: build-a-btree-index
lesson: 2
title: An in-memory pager
overview: Nodes reach each other through a pager, never directly. Today you build the smallest pager - one that hands out page ids and reads and writes whole page buffers - so the tree can allocate and revisit pages without knowing whether they live in RAM or a file.
goal: Build an in-memory pager whose AllocPage hands out increasing ids and whose ReadPage returns what WritePage stored.
spec:
  scenario: Allocate, write, and read back a page
  status: failing
  lines:
    - kw: Given
      text: a new in-memory pager
    - kw: When
      text: 'AllocPage is called twice'
    - kw: Then
      text: 'it returns page ids 0 then 1 (increasing, starting at 0)'
    - kw: And
      text: 'after WritePage(1, buf) where buf byte 0 is 0x2A, ReadPage(1) returns a buffer whose byte 0 is 0x2A'
code:
  lang: go
  source: |
    type Pager interface {
      AllocPage() PageID
      ReadPage(id PageID) []byte
      WritePage(id PageID, buf []byte)
      FreePage(id PageID) // used later
    }
    // in-memory impl: a slice of page buffers, next id = len
    type memPager struct { pages [][]byte }
checkpoint: The tree now has a pager it can allocate, write, and read pages through. Commit and stop here.
---

Every access to a node will go through a **pager**: allocate a fresh page, read
a page by id, write a page by id, and (later) free one. Putting this behind an
interface is the pivot the whole project turns on - the core chapters use a
simple in-memory pager, and the on-disk chapter swaps in a file-backed one with
no change to the tree. Because the tree only ever speaks `AllocPage` / `ReadPage`
/ `WritePage`, moving to disk is a pager swap, not a rewrite.

The in-memory pager is deliberately dull: keep a slice of page buffers, let
`AllocPage` return the next index and grow the slice, and let `ReadPage` /
`WritePage` index into it. Ids start at 0 and increase. That id-to-slot mapping is
exactly the id-to-offset mapping a file pager will use later, just with a slice
standing in for the file.
