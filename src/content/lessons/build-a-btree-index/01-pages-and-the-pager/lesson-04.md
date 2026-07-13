---
project: build-a-btree-index
lesson: 4
title: The node header
overview: Every node, leaf or internal, begins with the same small header - a type byte and a key count. Today you read and write that header so any page can announce what kind of node it holds and how many keys are in it.
goal: Write and read a node header - a one-byte node type and a two-byte key count - at the start of a page.
spec:
  scenario: Reading a node header
  status: failing
  lines:
    - kw: Given
      text: a zeroed page buffer
    - kw: When
      text: 'a header with node type leaf (0x00) and key count 2 is written'
    - kw: Then
      text: 'byte 0 is 0x00 and bytes 1 through 2 are 0x00 0x02'
    - kw: And
      text: 'writing node type internal (0x01) with key count 300 gives byte 0 = 0x01 and bytes 1 through 2 = 0x01 0x2C, and both headers read back their exact type and count'
code:
  lang: go
  source: |
    const (
      nodeLeaf     byte = 0x00
      nodeInternal byte = 0x01
    )
    // byte 0: node type; bytes 1-2: key count (uint16 big-endian)
    func nodeType(b []byte) byte      { return b[0] }
    func keyCount(b []byte) uint16    { /* getU16(b, 1) */ }
    func setHeader(b []byte, t byte, n uint16) { /* b[0]=t; putU16(b,1,n) */ }
checkpoint: Any page can now declare its node type and key count. Commit and stop here.
---

Both kinds of node share a **header** at the front of the page: one byte saying
whether this is a **leaf** (`0x00`) or an **internal** node (`0x01`), then a
two-byte count of how many keys the node holds. Fixing the header now means every
later read can start the same way - look at byte 0 to know how to parse the rest,
read the count to know how many entries follow.

The count is a `uint16` because a 4096-byte page can hold at most a few hundred
keys, so two bytes is plenty and keeps the header tight at three bytes. Everything
after byte 3 differs by node type, and the next chapter fills that in: a leaf packs
keys with values and a link to the next leaf, an internal node packs keys with
child page ids. The header is the one part they hold in common.
