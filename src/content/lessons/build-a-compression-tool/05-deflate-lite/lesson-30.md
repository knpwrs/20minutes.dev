---
project: build-a-compression-tool
lesson: 30
title: Choosing the smaller output
overview: A good compressor never makes a file bigger. Today Compress tries DEFLATE-lite, compares it against just storing the bytes, and keeps whichever is smaller - so incompressible input falls back to stored and never expands beyond the header.
goal: Have Compress pick the smaller of the DEFLATE-lite and stored encodings, and report the sizes.
spec:
  scenario: Incompressible input falls back to stored
  status: failing
  lines:
    - kw: Given
      text: 'the four-byte input 0x00, 0x01, 0x02, 0x03, which has no runs or repeats'
    - kw: When
      text: 'Compress runs'
    - kw: Then
      text: 'it chooses the stored method: the method byte is 0x00 and the total output is 11 bytes (4 payload plus the 7-byte header)'
    - kw: And
      text: 'for a long repetitive input the method byte is 0x01 and the compressed size is smaller than the original, with Ratio equal to compressed size divided by original size'
code:
  lang: go
  source: |
    func Compress(data []byte) []byte {
      stored := storeBlock(data)   // header + raw
      deflated := deflateEncode(data)
      if len(deflated) < len(stored) { return deflated }
      return stored                // ties and losses fall back to stored
    }
    // Stats: OriginalSize, CompressedSize, Ratio = Compressed/Original
checkpoint: Compress never expands input beyond the header; incompressible data is stored. Commit and stop here.
---

The final guarantee of a serious compressor is a **floor**: it must never make
data meaningfully bigger. High-entropy input - already compressed, encrypted, or
random - has no runs and no repeats, so DEFLATE-lite spends more on code tables
than it saves, and blindly using it would expand the file. The fix is to compute
**both** encodings and keep the smaller, with ties going to **stored**.

For `0x00 0x01 0x02 0x03` the DEFLATE-lite block, weighed down by its code tables,
loses to storing four raw bytes, so `Compress` emits the stored form: method `0x00`
and exactly `11` bytes, the four payload bytes plus the seven-byte header. That is
the worst case - a fixed seven bytes of overhead, never a multiplicative blowup.
Feed it long repetitive text instead and DEFLATE-lite wins easily: method `0x01`
and a compressed size well under the original. Exposing `OriginalSize`,
`CompressedSize`, and their ratio turns the tool from a black box into something
you can measure - the number the capstone will report.
