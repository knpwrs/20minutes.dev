---
project: build-a-btree-index
lesson: 33
title: The meta page
overview: A file of pages is useless unless something says which page is the root. Today you write the meta page - page 0 - holding a magic number, the page size, the root page id, the free-list head, and the page count, so the file describes itself.
goal: Read and write a meta page at page 0 carrying a magic number, page size, root page id, free-list head, and page count.
spec:
  scenario: The self-describing header page
  status: failing
  lines:
    - kw: Given
      text: 'a meta page with magic 0xB77E0001, page size 4096, root page id 5, free-list head 0, and page count 6'
    - kw: When
      text: it is written to page 0 and read back
    - kw: Then
      text: 'all five fields round-trip exactly: magic 0xB77E0001, page size 4096, root 5, free-list head 0, page count 6'
    - kw: And
      text: 'reading a page whose magic is not 0xB77E0001 is rejected as "not a B+Tree file" rather than parsed'
code:
  lang: go
  source: |
    const metaMagic uint32 = 0xB77E0001
    // page 0 layout: [magic:4][pageSize:4][root:4][freeHead:4][pageCount:4]
    func writeMeta(p Pager, root, freeHead, pageCount PageID) { /* putU32 fields */ }
    func readMeta(p Pager) (root, freeHead, pageCount PageID, err error) {
      // reject if magic != metaMagic
    }
checkpoint: The file now names its own root and shape in page 0. Commit and stop here.
---

Reopening a tree means finding its **root**, and a page id alone does not survive a
restart unless it is written down. That is the job of the **meta page** at page 0:
a small, fixed header that makes the file self-describing. It carries a **magic
number** so a wrong or corrupt file is caught immediately, the **page size** it was
created with, the **root page id**, the **free-list head** for recycling pages, and
the total **page count**.

Reserving page 0 for the meta is why the file pager never hands out id 0 as a node -
and why 0 works as the "no next leaf" sentinel. Checking the magic on open is the
first line of defense: a file that does not start with `0xB77E0001` is not one of
ours, and refusing to parse it beats reading garbage offsets. The next lessons make
`AllocPage` and `FreePage` keep the page count and free-list head in this page up to
date.
