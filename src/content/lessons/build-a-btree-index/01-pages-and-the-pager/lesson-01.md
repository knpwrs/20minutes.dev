---
project: build-a-btree-index
lesson: 1
title: A fixed-size page
overview: A B+Tree that lives on disk is made of fixed-size pages, and every tree node will be exactly one page. Today you define that page and the integer id that names it, so from the very first line nothing depends on host pointers.
goal: Define a fixed page size, a page buffer, and a page-id type, and confirm a fresh page is all zeros.
spec:
  scenario: Allocating a blank page
  status: failing
  lines:
    - kw: Given
      text: 'a page size of 4096 bytes'
    - kw: When
      text: a fresh page buffer is created
    - kw: Then
      text: it is exactly 4096 bytes long
    - kw: And
      text: every one of its bytes is 0
code:
  lang: go
  source: |
    const PageSize = 4096
    // a page id names a page; it will map to a file offset later
    type PageID uint32
    // a page is just a fixed-size byte buffer - a node lives inside one
    func newPage() []byte { return make([]byte, PageSize) }
checkpoint: You have a fixed-size page and a page-id type - the two atoms the whole index is built from. Commit and stop here.
---

A disk is not a graph of objects; it is a flat array of bytes you read and write
in fixed blocks. A B+Tree that intends to live there has to be built the same way,
so the first decision is the **page**: a fixed-size chunk of bytes (4096 here, a
common disk block size) that is the unit of everything. Every node in the tree -
leaf or internal - will be exactly one page, serialized into that buffer.

The other atom is the **page id**: a plain integer that names a page. Today it
names a slot in memory; in the on-disk chapter the same id becomes a file offset
(`id * PageSize`). Because nodes will refer to each other by page id rather than
by pointer, the tree is already shaped for disk from this first lesson - nothing
downstream ever leans on the garbage collector to hold a node in place.
