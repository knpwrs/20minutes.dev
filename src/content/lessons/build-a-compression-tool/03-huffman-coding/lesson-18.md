---
project: build-a-compression-tool
lesson: 18
title: The self-describing Huffman codec
overview: Now the pieces become one codec. Today you assemble header plus payload into a self-contained Huffman blob and decode it with nothing but the blob itself, proving the round trip end to end.
goal: Combine the length header, symbol count, and packed payload into one blob that decodes on its own.
spec:
  scenario: A Huffman blob decodes itself
  status: failing
  lines:
    - kw: Given
      text: 'the input ABRACADABRA'
    - kw: When
      text: 'huffmanEncode builds a blob of the length header, the symbol count, and the packed codes, and huffmanDecode reads only that blob'
    - kw: Then
      text: 'huffmanDecode returns ABRACADABRA, byte for byte'
    - kw: And
      text: 'the round trip holds for any input with at least one symbol, including a single-symbol input like ZZZZZ'
code:
  lang: go
  source: |
    // encode: frequencies -> lengths -> canonical codes
    //   symbolCount = number of symbols in the message (its length), NOT the
    //   distinct-symbol count already in the length header
    //   blob = serializeLengths + uint32(symbolCount) + packedPayload
    // decode: parse lengths, read count, rebuild codes, decode payload
    // no external state: the blob carries everything the decoder needs
checkpoint: The Huffman codec round-trips as a self-contained blob. The chapter is done - commit and stop here.
---

This is the chapter's payoff: a **self-describing** Huffman codec. `huffmanEncode`
counts frequencies, builds the lengths (single-symbol edge included), assigns
canonical codes, then emits a blob that is the **length header**, the **symbol
count** (the number of symbols in the message, so the decoder knows when to stop)
as a 32-bit field, and the **packed payload**. `huffmanDecode` needs
nothing else - it parses the header, reads the count, rebuilds the very same codes,
and decodes the bits back to the original bytes.

Running `ABRACADABRA` through both returns it unchanged, and so does a
single-symbol input like `ZZZZZ`, which exercises the length-1 edge from lesson 13
through the whole pipeline. On short inputs the two-bytes-per-symbol table can make
the blob larger than the input - that is expected and honest; Huffman wins on
longer, skewed data where the payload savings dwarf the fixed table cost. You now
have a complete entropy coder. The next chapter attacks a different kind of
redundancy - repeated substrings - and later you will feed its output through this
very codec.
