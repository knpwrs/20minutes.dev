---
project: build-a-btree-index
lesson: 32
title: A file-backed pager
overview: Everything so far serialized nodes into fixed pages, so moving to disk is a pager swap, not a rewrite. Today you implement the pager against a real file - page id maps to a byte offset, and whole pages read and write straight through.
goal: Implement the Pager interface against a file, mapping page id to file offset with id * PageSize.
spec:
  scenario: Reading and writing pages in a file
  status: failing
  lines:
    - kw: Given
      text: a file-backed pager over an empty file
    - kw: When
      text: 'a page whose byte 0 is 0x2A is written at page id 3'
    - kw: Then
      text: 'it is stored at file offset 12288 (3 * 4096), and reading page id 3 back returns a buffer whose byte 0 is 0x2A'
    - kw: And
      text: 'reading the same page id 3 through a freshly opened pager on the same file also returns 0x2A - the data is really on disk'
code:
  lang: go
  source: |
    type filePager struct { f *os.File }
    func (p *filePager) offset(id PageID) int64 { return int64(id) * PageSize }
    func (p *filePager) ReadPage(id PageID) []byte {
      buf := make([]byte, PageSize)
      // p.f.ReadAt(buf, p.offset(id))
      return buf
    }
    func (p *filePager) WritePage(id PageID, buf []byte) { /* WriteAt */ }
checkpoint: The same tree code now reads and writes pages on a real file. Commit and stop here.
---

This is the moment the whole "a node is a page" discipline pays off. Because every
node has been serialized into a fixed-size buffer since lesson 5, the only thing
that changes to put the tree on disk is *where those buffers live* - and that is one
new `Pager` implementation. The tree, the splits, the scans: none of it knows or
cares whether a page came from a slice or a file.

The mapping is deliberately trivial: page `id` lives at byte offset `id * PageSize`.
Fixed-size pages are what make this pure arithmetic - no index of where each page
sits, just multiply. Reading a page back through a **fresh** pager on the same file
is the real test that the bytes landed on disk and not just in a buffer. With this,
the tree is durable in the weak sense that it survives the process - the next
lessons make it survive a *crash*.
