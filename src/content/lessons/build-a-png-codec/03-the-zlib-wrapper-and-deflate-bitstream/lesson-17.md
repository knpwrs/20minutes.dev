---
project: build-a-png-codec
lesson: 17
title: The DEFLATE block header
overview: A DEFLATE stream is a sequence of blocks, each opening with three bits that say whether it is the last block and how it is encoded. Today you read that header, the fork in the road for the whole inflater.
goal: Read a block's final-flag bit and its two-bit type from the bit reader.
spec:
  scenario: Reading a block header
  status: failing
  lines:
    - kw: Given
      text: 'a bit reader at the byte 0x01'
    - kw: When
      text: 'the block header is read as one bit then two bits'
    - kw: Then
      text: 'the final flag is 1 and the block type is 0 (a stored block)'
    - kw: And
      text: 'a header read from the byte 0x04 gives final flag 0 and block type 2 (a dynamic-Huffman block)'
code:
  lang: go
  source: |
    // BFINAL is 1 bit, BTYPE is the next 2 bits (0=stored, 1=fixed, 2=dynamic)
    func readBlockHeader(r *BitReader) (final bool, btype uint32) {
      final = r.ReadBit() == 1
      btype = r.ReadBits(2)
      return
    }
checkpoint: You can read a block header and know which of the three decoders to run. Commit and stop here.
---

DEFLATE data is one or more **blocks**. Each block starts with a 1-bit **BFINAL** flag - is this the last block? - followed by a 2-bit **BTYPE** that selects the encoding: `0` for a **stored** (uncompressed) block, `1` for a **fixed-Huffman** block, `2` for a **dynamic-Huffman** block (`3` is reserved and invalid). Reading these three bits is how the inflater decides which decoder to run next, and the `BFINAL` flag is how it knows when to stop looping over blocks.

Note the bit order in action: from byte `0x01` (`0000_0001`), the first bit read is the low bit, `1`, so `BFINAL` is set; the next two bits are `00`, so `BTYPE` is a stored block. From `0x04` (`0000_0100`) the first bit is `0` and the next two are `10` read low-first, giving `BTYPE` 2, a dynamic block. Three bits decided everything; the rest of the chapter and the next build out the three decoders they point to.
