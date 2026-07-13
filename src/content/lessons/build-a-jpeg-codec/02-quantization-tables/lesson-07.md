---
project: build-a-jpeg-codec
lesson: 7
title: The DQT header byte
overview: A DQT segment defines one or more quantization tables, and each begins with a single byte that packs two fields. Today you split that byte into a precision and a table id.
goal: Split a DQT table-header byte into its precision (high nibble) and table id (low nibble).
spec:
  scenario: Splitting the quant-table header byte
  status: failing
  lines:
    - kw: Given
      text: 'the DQT header byte 0x00'
    - kw: When
      text: it is split
    - kw: Then
      text: 'the precision is 0 (8-bit values) and the table id is 0'
    - kw: And
      text: 'the byte 0x11 gives precision 1 (16-bit values) and table id 1'
code:
  lang: go
  source: |
    // one quant table starts with a byte: Pq<<4 | Tq
    //   Pq (high nibble): 0 = 8-bit values, 1 = 16-bit values
    //   Tq (low nibble):  table id, 0..3
    func splitQuantHeader(x byte) (precision, id byte) {
      // high nibble and low nibble
    }
checkpoint: You can read the precision and id of a quantization table. Commit and stop here.
---

The **DQT** segment (Define Quantization Table, marker `0xDB`) can carry several tables, and each one is introduced by a single byte that packs two four-bit fields. The high nibble is **Pq**, the precision: `0` means the 64 table entries are one byte each, `1` means they are two bytes each. The low nibble is **Tq**, the table id, a number from 0 to 3 that later frame components reference to say which table dequantizes them.

Splitting a byte into nibbles - high nibble is `x >> 4`, low nibble is `x & 0x0F` - is a move you will make constantly in JPEG. The very same packing appears in the Huffman table header, the sampling factors, and the entropy run-length symbols. Getting comfortable with it now pays off across the whole format.
