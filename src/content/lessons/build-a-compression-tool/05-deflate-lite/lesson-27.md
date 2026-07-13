---
project: build-a-compression-tool
lesson: 27
title: A code table for a wide alphabet
overview: The literal/length alphabet runs past 255, so its code-length table needs wider symbols than the byte table from chapter three. Today you build the two-byte-symbol table format the DEFLATE-lite header uses for both its streams.
goal: Serialize a code-length table whose symbols may exceed 255, using two-byte symbols, and parse it back.
spec:
  scenario: A wide-symbol length table round-trips
  status: failing
  lines:
    - kw: Given
      text: 'the code-length table with symbol 65 length 1, symbol 256 length 2, symbol 257 length 2'
    - kw: When
      text: 'it is serialized'
    - kw: Then
      text: 'the bytes are 0x00, 0x03, 0x00, 0x41, 0x01, 0x01, 0x00, 0x02, 0x01, 0x01, 0x02'
    - kw: And
      text: 'parsing those bytes returns the identical table (count is a uint16, then each record is a two-byte symbol and a one-byte length, symbols ascending)'
code:
  lang: go
  source: |
    // count as uint16 big-endian, then per symbol (ascending):
    //   symbol as uint16 big-endian, then length as one byte
    out = append(out, byte(n>>8), byte(n)) // 0x00,0x03
    for _, s := range sortedSymbols {
      out = append(out, byte(s>>8), byte(s), byte(length[s]))
    }
    // 65 -> 00 41 01 ; 256 -> 01 00 02 ; 257 -> 01 01 02
checkpoint: Code-length tables can describe alphabets larger than a byte. Commit and stop here.
---

The Huffman header from chapter three stored each symbol in a single byte, which is
fine for the byte alphabet it was built for. But the **literal/length** alphabet
reaches `257` and beyond, so a one-byte symbol field can no longer hold it. The fix
is a wider table: a **uint16** count, then one record per symbol of a **uint16
symbol** and a one-byte length, still in ascending symbol order.

For the table `{65:1, 256:2, 257:2}` that serializes to count `0x00 0x03`, then
`0x00 0x41 0x01` for symbol `65`, `0x01 0x00 0x02` for `256`, and `0x01 0x01 0x02`
for `257`. Parsing reverses it exactly. The DEFLATE-lite header uses this one
format for **both** streams - the literal/length table and the distance table -
even though distances happen to fit in a byte, because one consistent format is
simpler to read than two. The length values above are just an illustration of a
valid prefix set; the real ones come from Huffman. With a table format that spans
the whole alphabet, the encoder can assemble a full compressed block next.
