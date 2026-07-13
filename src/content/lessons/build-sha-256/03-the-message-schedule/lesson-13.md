---
project: build-sha-256
lesson: 13
title: The first sixteen schedule words
overview: Each block is expanded into 64 working words called the message schedule. The first sixteen come straight from the block's bytes, read four at a time as big-endian words. Today you build that extraction.
goal: Read a 64-byte block as the first sixteen 32-bit big-endian words W0 through W15.
spec:
  scenario: The block's bytes become sixteen big-endian words
  status: failing
  lines:
    - kw: Given
      text: 'the single 64-byte block from padding "abc"'
    - kw: When
      text: 'MessageWords(block) reads it as sixteen 32-bit words, each four consecutive bytes in big-endian order (most significant byte first)'
    - kw: Then
      text: 'W[0] is 0x61626380 (bytes 0x61 0x62 0x63 0x80) and W[1] is 0x00000000'
    - kw: And
      text: 'W[15] is 0x00000018 (the last four bytes hold the bit length), and there are exactly 16 words'
code:
  lang: go
  source: |
    // big-endian: the first byte is the most significant
    func MessageWords(block []byte) [16]uint32 {
      var w [16]uint32
      for t := 0; t < 16; t++ {
        b := block[t*4 : t*4+4]
        w[t] = uint32(b[0])<<24 | uint32(b[1])<<16 | uint32(b[2])<<8 | uint32(b[3])
      }
      return w
    }
checkpoint: You can read a block's first sixteen schedule words. Commit and stop here.
---

The compression function does not chew on raw bytes - it works on 32-bit **words**,
so the first thing it does with each 64-byte block is read it as sixteen words.
The 64 bytes map exactly to `16 * 4`, and each word is assembled **big-endian**:
the first of its four bytes is the most significant. So the four bytes
`0x61 0x62 0x63 0x80` become the single word `0x61626380`, not `0x80636261`. Byte
order is a classic place to go wrong, so pin it now against the "abc" block.

These sixteen words are `W[0]` through `W[15]`, the seed of the **message
schedule** - the 64-word array the rounds consume. The tail of this particular
block is telling: `W[15]` is `0x00000018`, the `24`-bit length you appended during
padding, now read back as a word. Next lesson the remaining 48 words are grown
from these sixteen by a recurrence.
