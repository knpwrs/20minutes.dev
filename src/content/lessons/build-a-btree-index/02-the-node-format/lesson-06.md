---
project: build-a-btree-index
lesson: 6
title: Parsing a leaf
overview: Reading a page is serializing in reverse. Today you parse a page back into a leaf node and confirm the round-trip is exact, so the tree can load a leaf from the pager and trust every field.
goal: Parse a leaf page back into keys, values, and a next-leaf link, exactly reversing serialization.
spec:
  scenario: Bytes become a leaf again
  status: failing
  lines:
    - kw: Given
      text: 'a page produced by serializing a leaf with keys [10, 20], values [100, 200], next-leaf link 5'
    - kw: When
      text: the page is parsed back into a leaf node
    - kw: Then
      text: 'its keys are [10, 20], its values are [100, 200], and its next-leaf link is 5'
    - kw: And
      text: 'parsing a serialized empty leaf (count 0) yields no keys, no values, and next-leaf link 0'
code:
  lang: go
  source: |
    func parseLeaf(b []byte) *LeafNode {
      n := int(keyCount(b))
      next := PageID(getU32(b, 3))
      // read n entries starting at offset leafHeader, 16 bytes apart
      // keys[i] = getU64(b, leafHeader+i*entrySize)
      // vals[i] = getU64(b, leafHeader+i*entrySize+8)
    }
checkpoint: Leaf serialization round-trips exactly - what you write, you read back. Commit and stop here.
---

Parsing is the mirror of serializing: read the count from the header, then walk
`count` entries from `leafHeader`, pulling an 8-byte key and 8-byte value from each
16-byte slot, and read the next-leaf link from offset 3. Because the layout is
fixed, there is no scanning or delimiter-hunting - the offsets are pure arithmetic.

Proving the **round-trip** (`parse(serialize(leaf)) == leaf`) is the real point of
today. From here on the tree can hand a page to the pager and read it back as a
node without ever second-guessing the bytes, which is what lets later lessons treat
"read the page for id X" as a reliable primitive. The empty-leaf case matters too:
a fresh leaf with zero entries must round-trip to an empty node, since that is
exactly what a brand-new tree's root will be.
