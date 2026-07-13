---
project: build-a-video-container-parser
lesson: 23
title: Chunk offsets
overview: The stco box lists where each chunk begins in the file, as absolute byte offsets. Today you parse that list - the anchor that ties the sample tables back to real positions in the media data.
goal: Parse an stco box into its list of 32-bit chunk offsets.
spec:
  scenario: An stco decodes to a list of chunk offsets
  status: failing
  lines:
    - kw: Given
      text: 'an stco with entry_count 2 and offsets 0x00 0x00 0x00 0x28 then 0x00 0x00 0x08 0x00'
    - kw: When
      text: 'the stco is parsed'
    - kw: Then
      text: 'the chunk offsets are [40, 2048]'
    - kw: And
      text: 'the entry count read from the box is 2'
code:
  lang: go
  source: |
    // FullBox prefix(4) + entry_count(4) + entry_count * offset(4)
    func parseStco(payload []byte) []uint64 {
      n := readU32(payload[4:8])
      // read n 32-bit offsets, widening each into a uint64
    }
checkpoint: You can parse 32-bit chunk offsets. Commit and stop here.
---

`stco`, the chunk-offset box, holds the **absolute byte offset** of each chunk from
the very start of the file. This is the table that finally connects the abstract
sample tables to concrete positions: `stsc` says which chunk a sample is in, and
`stco` says where that chunk physically starts. Here the two chunks begin at byte
`40` (`0x28`) and byte `2048` (`0x800`).

Store the offsets as `uint64` even though they are read as 32-bit values. That is
deliberate: the very next lesson introduces `co64`, the 64-bit variant for files
larger than 4 GB, and both tables should feed the same sample-location code. Reading
them into the same wide type now means that code never has to care which box
supplied the offsets.
