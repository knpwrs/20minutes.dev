---
project: build-a-png-codec
lesson: 18
title: Stored blocks
overview: The simplest DEFLATE block is not compressed at all - it just carries raw bytes with a length. Today you decode a stored block, which gives the inflater its first real output and a template for the harder blocks.
goal: Decode a stored (type 0) block by aligning to a byte boundary, reading its length, and copying that many literal bytes.
spec:
  scenario: Decoding an uncompressed block
  status: failing
  lines:
    - kw: Given
      text: 'the DEFLATE bytes 0x01, 0x05, 0x00, 0xFA, 0xFF, then the ASCII bytes for "Hello"'
    - kw: When
      text: the block is decoded
    - kw: Then
      text: 'the output is the five bytes "Hello"'
    - kw: And
      text: 'after the 3-bit header the reader skips to the next byte boundary, reads LEN=5 and NLEN=0xFFFA (the ones-complement of LEN), then copies LEN bytes'
code:
  lang: go
  source: |
    // after reading BFINAL/BTYPE: discard remaining bits in the current byte,
    // then read LEN (2 bytes, little-endian) and NLEN (2 bytes). NLEN must be
    // ~LEN. Copy the next LEN bytes straight to the output.
    func inflateStored(r *BitReader, out *[]byte) { }
checkpoint: The inflater produces its first bytes from a stored block. Commit and stop here.
---

A **stored block** is DEFLATE's escape hatch: data that would not compress is written verbatim. After the 3-bit block header, the encoder **skips any leftover bits** to realign on a byte boundary, then writes a 2-byte **LEN** (little-endian this time, unlike PNG's big-endian integers) and a 2-byte **NLEN** that is LEN's ones-complement - a redundancy check. Then come exactly `LEN` raw bytes, which you copy straight to the output. In the example `LEN` is `5`, `NLEN` is `0xFFFA`, and the five bytes spell `Hello`.

This block is worth building first because it is the whole inflate loop in miniature - read a header, decode a block, append to a growing output buffer - minus the Huffman machinery. That output buffer is important: it is the same buffer the next chapter's back-references will reach into, so treat it as the single accumulating result of the entire stream. With stored blocks working, the two Huffman block types are what remain.
