---
project: build-a-compression-tool
lesson: 17
title: Serializing the code-length table
overview: A compressed file must carry the code lengths so the decoder can rebuild the codes. Today you serialize the length table into a compact header and parse it back - the last piece before a self-describing Huffman codec.
goal: Serialize the per-symbol code lengths into header bytes and parse them back.
spec:
  scenario: The length table round-trips through bytes
  status: failing
  lines:
    - kw: Given
      text: 'the code lengths A:1, B:3, C:3, D:3, R:3'
    - kw: When
      text: 'the table is serialized'
    - kw: Then
      text: 'the header bytes are 0x05, 0x41, 0x01, 0x42, 0x03, 0x43, 0x03, 0x44, 0x03, 0x52, 0x03'
    - kw: And
      text: 'parsing those bytes returns the identical length table'
code:
  lang: go
  source: |
    // header = count byte, then (symbol, length) pairs in ascending symbol order
    out = append(out, byte(len(lengths)))            // 0x05
    for _, sym := range sortedSymbols(lengths) {
      out = append(out, sym, byte(lengths[sym]))     // 0x41,0x01  0x42,0x03  ...
    }
    // parse: read count, then that many (symbol, length) pairs
checkpoint: The code-length table serializes and parses back exactly. Commit and stop here.
---

The decoder can rebuild every canonical code from the lengths, so the header only
has to carry the lengths - nothing about the tree or the codes themselves. Store a
**count** of how many symbols there are, then one `(symbol, length)` pair per
symbol, in ascending symbol order so the decoder reconstructs codes in the same
order the encoder assigned them.

For our alphabet that is `0x05` (five symbols) followed by `(0x41, 0x01)` for `A`,
then `(0x42, 0x03)`, `(0x43, 0x03)`, `(0x44, 0x03)`, `(0x52, 0x03)` for `B, C, D,
R`. Parsing just reverses it: read the count, then that many pairs. This pairs
format is simple and honest; it costs two bytes per distinct symbol, which is why
tiny inputs do not shrink - the table can outweigh the payload. Real DEFLATE
squeezes the table itself with another layer of coding, a refinement noted in the
caveats. With the header able to round-trip, the full codec comes together next.
