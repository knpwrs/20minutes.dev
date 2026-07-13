---
project: build-a-compression-tool
lesson: 26
title: Two symbol streams from tokens
overview: To Huffman-code LZSS output you first turn tokens into symbols. Today you map the token stream into two alphabets - literals-and-lengths in one, distances in the other - exactly the split DEFLATE uses.
goal: Convert a token stream into a literal/length symbol stream and a distance symbol stream.
spec:
  scenario: Tokens split into two symbol streams
  status: failing
  lines:
    - kw: Given
      text: 'the tokens for ABCABCD: Literal A, Literal B, Literal C, Match(offset 3, length 3), Literal D'
    - kw: When
      text: 'they are mapped to symbols with minimum match 3'
    - kw: Then
      text: 'the literal/length stream is 65, 66, 67, 257, 68, 256 and the distance stream is 3'
    - kw: And
      text: 'a literal maps to its byte value, a match length L maps to 257 + (L - 3), the trailing 256 is the end-of-block marker, and each match adds its offset to the distance stream'
code:
  lang: go
  source: |
    // literal/length alphabet: 0..255 literals, 256 = end of block,
    //   257+ = match length (symbol = 257 + (length - MIN_MATCH))
    // distance alphabet: the raw offset
    // literal -> litlen += byte
    // match   -> litlen += 257+(len-3); dist += offset
    // finally append 256 (EOB) to litlen
checkpoint: Tokens become a literal/length stream and a distance stream. Commit and stop here.
---

DEFLATE's insight is to compress the LZSS token stream itself with Huffman coding,
and to do that it needs the tokens as **symbols**. It uses two alphabets. The
**literal/length** alphabet packs three things into one code space: values `0..255`
are literal bytes, `256` is a special **end-of-block** marker, and `257` and up are
match **lengths** (`symbol = 257 + (length - MIN_MATCH)`). The **distance**
alphabet holds match **offsets**.

Splitting this way lets each alphabet get its own Huffman code tuned to its own
statistics - literals and lengths cluster differently from distances. For
`ABCABCD` the three literals become `65, 66, 67`, the `Match(3, 3)` becomes length
symbol `257` in the literal/length stream plus offset `3` in the distance stream,
the last literal is `68`, and a closing `256` marks the end. The decoder reads the
literal/length stream and, whenever it hits a length symbol, pulls the next
distance from the distance stream - the two move in lockstep. Real DEFLATE folds
ranges of lengths and distances into shared codes with extra bits; we give each
value its own symbol to keep the numbers exact, a simplification the caveats note.
