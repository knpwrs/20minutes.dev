---
project: build-a-btree-index
lesson: 41
title: The double meta page
overview: To publish a new root atomically you need two places to write it, so one always holds a complete commit. Today you reserve two meta slots - pages 0 and 1 - each carrying a sequence number and a checksum.
goal: Reserve two meta slots at pages 0 and 1, each holding the meta fields plus a monotonically increasing sequence number and a checksum.
spec:
  scenario: Two meta slots that alternate
  status: failing
  lines:
    - kw: Given
      text: 'a tree file whose pages 0 and 1 are both reserved as meta slots (so AllocPage starts handing out node pages at id 2)'
    - kw: When
      text: 'meta slot 0 is written with sequence 1, root 4, and a valid checksum'
    - kw: Then
      text: 'slot 0 reads back with sequence 1 and root 4 and validates, while slot 1 is independent (its own sequence and checksum)'
    - kw: And
      text: 'AllocPage never returns 0 or 1, and a freshly created file starts with page count 2'
code:
  lang: go
  source: |
    // pages 0 and 1 are the two meta slots. layout of each:
    //   [magic:4][pageSize:4][root:4][freeHead:4][pageCount:4][seq:8][checksum:4]
    // slotFor(seq) alternates: even seq -> slot 0, odd seq -> slot 1
    // (or simply: write the new commit to whichever slot is older).
checkpoint: The file has two alternating meta slots, each self-checking. Commit and stop here.
---

Publishing a new root atomically needs **two** meta slots, not one. With a single
meta, overwriting it is itself an in-place write that a crash can tear, leaving no
valid root at all. Two slots solve this by **ping-ponging**: each commit writes the
*other* slot, so at every instant at least one slot holds a complete, previously
committed meta. Pages 0 and 1 are both reserved for this, which is why node
allocation now starts at page 2.

Each slot carries a **sequence number** that increases by one per commit, plus the
**checksum** from lesson 38. Together they answer the two questions open will ask:
which slot is newer (higher sequence) and is it intact (checksum valid). This is
exactly LMDB's design - two meta pages, alternated, each self-describing - and it is
a deliberate contrast to a write-ahead log: instead of logging changes and
replaying them, you keep the whole tree consistent at all times and flip a single
pointer to publish. The flip itself, with its fsync ordering, is next.
