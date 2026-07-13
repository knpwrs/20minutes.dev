---
project: build-a-compression-tool
lesson: 29
title: Decoding a DEFLATE-lite block
overview: The decoder reverses the whole pipeline - read both tables, decode symbols until the end-of-block marker, rebuild tokens, and expand them. Today you close the loop and prove decompress(compress(x)) for the combined codec.
goal: Decode a DEFLATE-lite block back to the original bytes and confirm the round trip.
spec:
  scenario: A DEFLATE-lite block round-trips
  status: failing
  lines:
    - kw: Given
      text: 'the DEFLATE-lite block produced by deflateEncode for ABCABCD'
    - kw: When
      text: 'deflateDecode reads it'
    - kw: Then
      text: 'it returns ABCABCD'
    - kw: And
      text: 'deflateDecode(deflateEncode(x)) equals x for any input, including longer repetitive text'
code:
  lang: go
  source: |
    // read litlen table + dist table (rebuild canonical codes for each)
    // decode litlen symbols until 256 (end of block):
    //   symbol < 256 -> literal byte
    //   symbol >= 257 -> length = (symbol-257)+MIN_MATCH; decode next distance
    //     symbol -> offset; emit Match, copying byte-by-byte (overlap-safe)
    // the result is the original bytes
checkpoint: The DEFLATE-lite codec round-trips end to end. Commit and stop here.
---

Decoding walks everything backward. First read the two **code tables** and rebuild
the canonical codes for each stream, just as the byte Huffman decoder did. Then
decode **literal/length** symbols one by one until the **end-of-block** marker
`256`: a symbol below `256` is a literal byte appended to the output; a symbol
`257` or above is a match, whose length is `(symbol - 257) + MIN_MATCH` and whose
distance comes from decoding the next symbol in the **distance** stream.

Each match is expanded with the same **overlap-safe**, byte-at-a-time copy from
lesson 22, so runs encoded as long matches rebuild correctly. When the marker
arrives, the output is the original bytes. That completes the combined codec:
`deflateDecode(deflateEncode(x))` returns `x`, for the small `ABCABCD` and for
longer repetitive text where the two-stage approach really shines. Two independent
kinds of redundancy - repeats and skew - are now squeezed by one pipeline, and it
is exactly reversible. All that remains is to let the tool choose this method only
when it actually helps.
