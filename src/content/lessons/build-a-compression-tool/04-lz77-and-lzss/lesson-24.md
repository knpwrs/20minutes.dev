---
project: build-a-compression-tool
lesson: 24
title: The LZSS codec end to end
overview: Time to run the matcher on real repetitive text. Today you wire tokenize and decode into one codec and watch a periodic string collapse to a handful of tokens that expand back exactly.
goal: Round-trip repetitive text through the full LZSS codec and confirm it produces far fewer tokens than bytes.
spec:
  scenario: A periodic string collapses and restores
  status: failing
  lines:
    - kw: Given
      text: 'the twelve-byte input ABABABABABAB with a minimum match of 3'
    - kw: When
      text: 'it is tokenized'
    - kw: Then
      text: 'the tokens are Literal A, Literal B, Match(offset 2, length 10) - three tokens for twelve bytes'
    - kw: And
      text: 'decoding those tokens returns ABABABABABAB, and decode(tokenize(x)) holds for any input'
code:
  lang: go
  source: |
    // lzssEncode: walk with findMatch (bounded window, MIN_MATCH)
    //   -> []Token ; lzssDecode: literals + overlapping copies -> []byte
    // ABABABABABAB: A,B literal, then position 2 matches 10 bytes at offset 2
    // (the overlapping copy from lesson 22 is what makes length 10 work)
checkpoint: The LZSS codec round-trips real repetitive text. The chapter is done - commit and stop here.
---

Wiring `tokenize` and `decode` together gives the finished **LZSS codec**, and a
periodic input shows off why it matters. `ABABABABABAB` starts with two literals -
`A` and `B` have no earlier copy - and then position 2 finds a match reaching all
the way to the end: `offset 2, length 10`. Three tokens now stand for twelve bytes,
and decoding leans on the **overlapping copy** from lesson 22, since the length
runs far past the offset.

That is the LZSS story in one example: literals seed the pattern, then a single
long match replays it. The codec is language-neutral because it is defined by the
token stream, not by any library. Right now the tokens are still abstract objects,
not bytes - deliberately. The next chapter takes these literal, length, and
distance values and feeds them through the Huffman coder you already built,
combining the two forms of redundancy into one real compressor.
