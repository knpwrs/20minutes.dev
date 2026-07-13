---
project: build-a-jpeg-codec
lesson: 11
title: The DHT header byte
overview: A DHT segment defines Huffman tables, and each starts with a byte naming which table it is. Today you split it into a class and an id, distinguishing DC tables from AC tables.
goal: Split a DHT table-header byte into its class (high nibble) and table id (low nibble).
spec:
  scenario: Splitting the Huffman-table header byte
  status: failing
  lines:
    - kw: Given
      text: 'the DHT header byte 0x00'
    - kw: When
      text: it is split
    - kw: Then
      text: 'the class is 0 (a DC table) and the table id is 0'
    - kw: And
      text: 'the byte 0x11 gives class 1 (an AC table) and table id 1, and a class nibble other than 0 or 1 (for example the byte 0x20) is rejected as invalid'
code:
  lang: go
  source: |
    // one Huffman table starts with a byte: Tc<<4 | Th
    //   Tc (high nibble): 0 = DC table, 1 = AC table
    //   Th (low nibble):  table id, 0..3
    // unlike the quant precision, only classes 0 and 1 are valid: reject others.
    func splitHuffHeader(x byte) (class, id byte, ok bool) { }
checkpoint: You can read the class and id of a Huffman table. Commit and stop here.
---

The **DHT** segment (Define Huffman Table, marker `0xC4`) works just like DQT: it can carry several tables, each introduced by a byte packing two nibbles. The high nibble is **Tc**, the class - `0` for a **DC** table (used for the DC coefficient of each block) and `1` for an **AC** table (used for the 63 AC coefficients). The low nibble is **Th**, the table id from 0 to 3. A baseline JPEG typically ships four tables: DC and AC for luminance, DC and AC for chrominance.

Keeping DC and AC tables separate matters because they decode different things - a DC symbol is a magnitude category, while an AC symbol packs a zero-run and a magnitude category into one byte. The class you read here is what tells the scan decoder which of a component's two tables to reach for at each step.
