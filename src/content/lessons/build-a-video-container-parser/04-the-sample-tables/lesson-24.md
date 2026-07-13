---
project: build-a-video-container-parser
lesson: 24
title: 64-bit chunk offsets
overview: Files larger than 4 GB use co64 instead of stco, with 64-bit chunk offsets. Today you parse that variant, pinning the boundary where a 32-bit reader would silently fail.
goal: Parse a co64 box into its list of 64-bit chunk offsets.
spec:
  scenario: A co64 decodes to 64-bit offsets
  status: failing
  lines:
    - kw: Given
      text: 'a co64 with entry_count 2 and offsets 0x00 0x00 0x00 0x00 0x00 0x00 0x00 0x28 then 0x00 0x00 0x00 0x01 0x00 0x00 0x00 0x00'
    - kw: When
      text: 'the co64 is parsed'
    - kw: Then
      text: 'the chunk offsets are [40, 4294967296]'
    - kw: And
      text: 'the second offset is exactly 2 to the 32nd power, which a 32-bit reader would truncate to 0'
code:
  lang: go
  source: |
    // identical to stco but each offset is a big-endian uint64
    func parseCo64(payload []byte) []uint64 {
      n := readU32(payload[4:8])
      // read n 64-bit offsets from offset 8, 8 bytes each
    }
checkpoint: You can parse 64-bit chunk offsets. Commit and stop here.
---

`co64` is `stco` with wider offsets: each chunk offset is a **64-bit** value instead
of 32-bit, used when the media data extends past the 4 GB that a 32-bit offset can
address. A file has one or the other, never both, and they mean exactly the same
thing - so the parser reads either into the same `uint64` offset list. Here the
second offset `0x0000000100000000` is `4294967296`, precisely `2^32`.

That value is the point of the lesson: a parser that read `co64` offsets with a
32-bit reader would truncate it to `0` and place the chunk at the start of the file.
Because you widened `stco` offsets to `uint64` yesterday, both tables now produce
the identical shape, and the sample-location code you write next works regardless of
which one a file uses.
