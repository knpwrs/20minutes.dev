---
project: build-a-btree-index
lesson: 36
title: Opening a tree from a file
overview: A persistent index has to reopen from its file. Today you write Open - it reads the meta page, checks the magic, and reconstructs the tree pointing at the stored root - and Close, which writes the current meta back.
goal: Open an existing tree file by reading its meta page and pointing the tree at the stored root, and Close by writing the meta.
spec:
  scenario: Reconstructing a tree from its file
  status: failing
  lines:
    - kw: Given
      text: 'a tree file created and populated, then Closed (its meta written with the current root, free-list head, and page count)'
    - kw: When
      text: 'Open is called on that file path'
    - kw: Then
      text: 'it reads the meta, verifies the magic, and returns a tree whose root is the stored root page id, with the same page count and free-list head'
    - kw: And
      text: 'opening a file whose magic is wrong returns an error instead of a tree'
code:
  lang: go
  source: |
    func Open(path string) (*Tree, error) {
      // open (create if missing) the file
      // brand-new/empty file: bootstrap it - NewTree over the pager makes
      //   an empty leaf root (page 1), then writeMeta the initial header
      // existing file: read meta (page 0); check magic -> error if wrong
      //   root, freeHead, pageCount := readMeta(...)
      //   return &Tree{pager: filePager{f, pageCount, freeHead}, root: root}
    }
    func (t *Tree) Close() error {
      // writeMeta(current root, freeHead, pageCount); close the file
    }
checkpoint: A tree round-trips through its file - Open finds the root Close saved. Commit and stop here.
---

`Open` is the inverse of everything the file pager does: point at a file, read page
0, confirm the magic, and lift out the `root`, `freeHead`, and `pageCount` to
reconstruct a tree that resumes exactly where the last one left off. The tree needs
nothing else - the root id is the single thread you pull to reach every node, all of
which are already on disk in their pages.

`Close` is the other half: it writes the current meta back so the next `Open` finds
the right root. Whenever the tree's root changes - a root split grows one, a
collapse replaces one - that new root id must reach the meta, and for a **clean**
shutdown, writing it at `Close` is enough. What `Close` does *not* yet guarantee is
survival of a **crash** mid-write, where the process never reaches `Close` at all -
that is the entire next chapter. First, prove the clean round-trip.
