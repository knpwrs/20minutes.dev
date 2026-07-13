---
project: build-a-compression-tool
lesson: 16
title: Decoding the bit stream
overview: Decoding a prefix code means reading bits until they match a code, then emitting that symbol. Today you rebuild the canonical codes from the lengths and decode the packed stream back to the original message.
goal: Decode a packed bit stream to symbols, given the code lengths and the symbol count.
spec:
  scenario: The packed bytes decode back to the message
  status: failing
  lines:
    - kw: Given
      text: 'the packed bytes 0x4E, 0xAC, 0x9C, the code lengths A:1, B:3, C:3, D:3, R:3, and a symbol count of 11'
    - kw: When
      text: 'the stream is decoded'
    - kw: Then
      text: 'the output is the message ABRACADABRA'
    - kw: And
      text: 'reading stops after 11 symbols, ignoring the padding bit in the final byte'
code:
  lang: go
  source: |
    // rebuild canonical codes from lengths, then read bit by bit:
    //   grow a candidate code one bit at a time
    //   when (length, candidate) matches a symbol's code, emit it and reset
    // stop once `count` symbols have been emitted (do not read the padding)
    for len(out) < count {
      cur = (cur << 1) | br.ReadBit(); curLen++
      if sym, ok := table[key(curLen, cur)]; ok { out = append(out, sym); cur, curLen = 0, 0 }
    }
checkpoint: The packed stream decodes back to the exact message. Commit and stop here.
---

Decoding a prefix code is a bit-at-a-time match. Rebuild the same canonical codes
from the lengths (the decoder has no tree, only lengths, exactly as intended), then
read bits one by one, growing a candidate value and its length. The instant the
candidate matches a real code, emit that symbol and start a fresh candidate.
Because no code is a prefix of another, the first match is always the right one -
there is never ambiguity about where a code ends.

The **symbol count** is what tells decoding when to stop: read until you have
emitted that many symbols, then quit, leaving the padding bits in the final byte
unread. Without the count you could not distinguish a real trailing code from
padding. Feeding `0x4E, 0xAC, 0x9C` with the lengths and a count of `11` returns
`ABRACADABRA`, closing the loop on the raw Huffman codec. What remains is to store
the lengths and the count alongside the payload so the file describes itself -
that is the next lesson.
