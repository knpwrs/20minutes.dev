---
project: build-a-qr-code-encoder
lesson: 17
title: Pad bytes
overview: 'The last gap between a byte-aligned payload and the symbol''s full capacity is filled with two alternating pad bytes. Today you add them and complete the 13 data codewords of HELLO WORLD - the exact block you fed into Reed-Solomon earlier.'
goal: 'Fill the remaining capacity with alternating pad bytes 0xEC and 0x11.'
spec:
  scenario: 'Pad bytes fill to full capacity'
  status: failing
  lines:
    - kw: Given
      text: 'the 10 byte-aligned codewords of HELLO WORLD and a Version 1-Q capacity of 13 codewords'
    - kw: When
      text: 'the remaining 3 codewords are filled by alternating the pad bytes 0xEC (236) and 0x11 (17), starting with 0xEC'
    - kw: Then
      text: 'the three added bytes are 236, 17, 236'
    - kw: And
      text: 'the complete data block is [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236] - the same 13 codewords rsEncode consumed in the Reed-Solomon chapter'
code:
  lang: go
  source: |
    // Alternate 0xEC, 0x11, 0xEC, ... until capacity is reached.
    pads := []byte{0xEC, 0x11}
    for i := 0; len(data) < capacityCodewords; i++ {
      data = append(data, pads[i%2])
    }
checkpoint: 'You can turn any string into its full block of data codewords. Commit and stop here.'
---

After the terminator and byte padding, the payload is a whole number of bytes but usually still short of the symbol's capacity. The standard fills the rest with two **pad bytes** applied in strict alternation: `0xEC` (`11101100`) then `0x11` (`00010001`), repeating `0xEC, 0x11, 0xEC, 0x11, ...` until the block is full. These specific values are fixed by the specification; they are chosen to look busy rather than blank so the finished symbol has a balanced pattern.

HELLO WORLD at level Q needs three more codewords, so it gets `0xEC, 0x11, 0xEC` - `236, 17, 236` - completing the block `[32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236]`. This closes the loop with the Reed-Solomon chapter: these are exactly the 13 data codewords you handed to `rsEncode` to get the error-correction codewords. From here the two halves join - but first, one lesson to show the same pipeline handles a second mode.
