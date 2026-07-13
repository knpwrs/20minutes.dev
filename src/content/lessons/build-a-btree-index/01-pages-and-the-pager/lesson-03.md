---
project: build-a-btree-index
lesson: 3
title: Packing integers into a page
overview: Keys, values, and page ids all become bytes inside a page, so you need one exact, portable way to write and read integers. Today you pin big-endian encoding of a 64-bit and a 32-bit integer at a byte offset.
goal: Write and read big-endian uint64 and uint32 values at a byte offset inside a page.
spec:
  scenario: Big-endian round-trip inside a page
  status: failing
  lines:
    - kw: Given
      text: a zeroed page buffer
    - kw: When
      text: 'the uint64 value 10 is written big-endian at offset 0'
    - kw: Then
      text: 'bytes 0 through 7 are 0x00 0x00 0x00 0x00 0x00 0x00 0x00 0x0A'
    - kw: And
      text: 'writing the uint32 value 5 big-endian at offset 8 gives bytes 8 through 11 = 0x00 0x00 0x00 0x05, and reading both offsets back yields 10 and 5'
code:
  lang: go
  source: |
    // big-endian: most significant byte first, so keys sort by raw byte order
    func putU64(b []byte, off int, v uint64) { /* b[off]=v>>56 ... b[off+7]=v */ }
    func getU64(b []byte, off int) uint64 { /* reassemble 8 bytes */ }
    func putU32(b []byte, off int, v uint32) { /* 4 bytes */ }
    func getU32(b []byte, off int) uint32 { /* 4 bytes */ }
checkpoint: You can pack and unpack the two integer widths the format needs, byte for byte. Commit and stop here.
---

A page is bytes, but keys and page ids are integers, so every field in the format
comes down to writing an integer at an offset and reading it back. Fixing the
encoding once, here, keeps every later serialize and parse lesson honest: a
`uint64` key is eight bytes, a `uint32` page id is four, and both are written
**big-endian** - most significant byte first.

Big-endian is a deliberate choice, not a toss-up. When integers are stored
most-significant-byte-first, their raw byte order matches their numeric order, so
later a memcmp-style comparison of encoded keys would sort them correctly. It also
makes hand-checking a page dump easy: the value 10 ends in `0x0A`, right where you
would expect it. Everything the tree stores is built on these four helpers.
