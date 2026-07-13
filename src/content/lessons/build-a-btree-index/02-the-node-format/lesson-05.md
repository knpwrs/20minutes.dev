---
project: build-a-btree-index
lesson: 5
title: Serializing a leaf
overview: A leaf node holds the actual keys and values, packed into one page. Today you serialize a leaf - its header, its next-leaf link, and its sorted key/value entries - into exact bytes, so a node can be written to a page and later to disk.
goal: Serialize a leaf node (keys, values, and a next-leaf link) into a 4096-byte page with an exact byte layout.
spec:
  scenario: A leaf becomes bytes
  status: failing
  lines:
    - kw: Given
      text: 'a leaf with keys [10, 20], values [100, 200], and next-leaf link 5'
    - kw: When
      text: it is serialized into a page
    - kw: Then
      text: 'byte 0 is 0x00 (leaf), bytes 1-2 are 0x00 0x02 (count 2), and bytes 3-6 are 0x00 0x00 0x00 0x05 (next-leaf 5)'
    - kw: And
      text: 'from offset 7 the entries are key 10, value 100, key 20, value 200 - each an 8-byte big-endian integer (16 bytes per entry) - and every remaining byte is 0'
code:
  lang: go
  source: |
    type LeafNode struct { Keys, Vals []uint64; Next PageID }
    // layout: [type:1][count:2][next:4] then entries of [key:8][val:8]
    const leafHeader = 7        // 1 + 2 + 4
    const entrySize  = 16       // 8-byte key + 8-byte value
    func serializeLeaf(n *LeafNode) []byte {
      // setHeader(nodeLeaf, len(Keys)); putU32(b,3,Next); then each entry
    }
checkpoint: A leaf node can be written to a page as exact bytes. Commit and stop here.
---

A **leaf** is where the index actually stores data: sorted keys, each paired with
a value (here a `uint64`, standing in for a row pointer). Its page starts with the
shared header, then a four-byte **next-leaf link** (the page id of the leaf to its
right - the thing range scans will follow), then the entries: each key immediately
followed by its value, in sorted key order.

Because keys and values are both fixed-width, entry `i` always lives at a
predictable offset - `leafHeader + i * entrySize` - which is what makes an
in-page binary search possible later. Nothing here is variable-length or
pointer-based; the whole leaf is a self-contained block of bytes that means the
same thing in RAM and on disk. That is the property the entire crash-safety story
will eventually depend on.
