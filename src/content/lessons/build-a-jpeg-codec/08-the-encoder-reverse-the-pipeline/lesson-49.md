---
project: build-a-jpeg-codec
lesson: 49
title: Writing tables
overview: A valid JPEG must carry the quantization and Huffman tables the decoder needs. Today you serialize the standard tables into DQT and DHT segments.
goal: Serialize a quantization table into a DQT segment and a Huffman table into a DHT segment with correct markers and lengths.
spec:
  scenario: Writing a DHT segment
  status: failing
  lines:
    - kw: Given
      text: 'the standard luminance DC Huffman table (16 count bytes, then 12 symbol bytes)'
    - kw: When
      text: it is serialized into a DHT segment
    - kw: Then
      text: 'the segment begins 0xFF, 0xC4, then the two length bytes 0x00, 0x1F (length 31), then the table-class byte 0x00'
    - kw: And
      text: 'the length 31 counts the 2 length bytes, the 1 class byte, the 16 count bytes, and the 12 symbol bytes'
    - kw: And
      text: 'a DQT segment for one 8-bit table begins 0xFF, 0xDB, then length 0x00, 0x43 (67 = 2 + 1 + 64), then the precision-and-id byte 0x00'
code:
  lang: go
  source: |
    // DHT: FF C4, 2-byte length, then per table: (Tc<<4|Th),
    //   16 BITS bytes, then HUFFVAL symbols.
    // DQT: FF DB, 2-byte length, then per table: (Pq<<4|Tq), 64 value bytes.
    // length always counts itself (the 2 length bytes).
    func writeDHT(tables []HuffSpec) []byte { }
checkpoint: You can write DQT and DHT segments. Commit and stop here.
---

For a decoder to read your file it needs the same **quantization and Huffman tables** you encoded with, so the encoder must write them out. The **DHT** segment starts with marker `FF C4`, a two-byte length, and then each table's class-and-id byte followed by its 16 count bytes and its symbol list. For the standard luminance DC table (16 counts + 12 symbols) that is a length of `2 + 1 + 16 + 12 = 31`, or `00 1F`, remembering that the length always counts its own two bytes. The **DQT** segment is analogous: `FF DB`, a length, then each table's precision-and-id byte and its 64 values.

You use the same standard tables the spec's Annex K defines and that the decoder chapters already understood - so the round trip is guaranteed to line up. Serializing tables is mechanical, but the length arithmetic is exactly the framing the decoder's segment walk relies on, and an off-by-two here would derail the whole parse. With the tables writable, only the frame and scan headers and the final assembly remain.
