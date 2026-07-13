---
project: build-a-compression-tool
lesson: 31
title: Empty input
overview: The emptiest input is the sharpest test of a codec's edges. Today you pin that compressing nothing yields just a header, and decompressing it returns nothing - no crash, no phantom bytes.
goal: Round-trip an empty input through Compress and Decompress.
spec:
  scenario: Empty input round-trips to empty
  status: failing
  lines:
    - kw: Given
      text: 'an empty input (zero bytes)'
    - kw: When
      text: 'Compress runs'
    - kw: Then
      text: 'the output is the 7-byte stored container 0x5A, 0x5A, 0x00, 0x00, 0x00, 0x00, 0x00 (original length 0)'
    - kw: And
      text: 'Decompress of that container returns an empty result, so Decompress(Compress(empty)) is empty'
code:
  lang: go
  source: |
    // empty input: original length 0. deflate would still emit code tables,
    // so stored (7 bytes) wins and Compress returns just the header.
    // Decompress reads length 0 and returns an empty slice - guard the
    // loops so "no symbols" and "no payload" do not panic.
    if len(data) == 0 { /* stored path yields header only */ }
checkpoint: Empty input compresses to a bare header and decompresses to nothing. Commit and stop here.
---

Empty input is the boundary every codec must survive, and it exercises the whole
stack at zero size. `Compress` of nothing computes both encodings: the DEFLATE-lite
form still carries code tables and so is larger, meaning **stored** wins and the
output is just the seven-byte header with an original length of `0`. `Decompress`
reads that length, runs no copy loop, and returns an empty slice.

The value here is in the guards. A decode loop that assumes at least one symbol, or
a table reader that assumes at least one entry, will happily crash on empty input
unless you check for the zero case. Pinning `Decompress(Compress(empty)) == empty`
forces those guards into place. It is a small spec with an outsized payoff: the
same "handle zero gracefully" discipline is what keeps the tool from panicking on
truncated or degenerate files, which is exactly where the next lesson goes.
