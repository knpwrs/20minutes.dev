---
project: build-a-jpeg-codec
lesson: 26
title: End-of-block and ZRL
overview: Two AC symbols mean something other than place a value - end-of-block and the sixteen-zero run. Today you handle both, completing the AC decode loop.
goal: Handle the special AC symbols 0x00 (end of block) and 0xF0 (a run of sixteen zeros).
spec:
  scenario: The special AC symbols
  status: failing
  lines:
    - kw: Given
      text: 'an AC decode loop positioned at index 1'
    - kw: When
      text: 'the AC symbol 0x00 is decoded, and separately the AC symbol 0xF0 is decoded'
    - kw: Then
      text: 'the symbol 0x00 (end of block) leaves every remaining coefficient (indices 1 through 63) at zero and stops the block'
    - kw: And
      text: 'the symbol 0xF0 (ZRL) skips exactly 16 coefficients as zeros, advancing the index from 1 to 17 without placing a value'
code:
  lang: go
  source: |
    // in the AC loop, before treating (run,size) as an ordinary pair:
    //   sym == 0x00 -> end of block: stop; the rest of the block stays zero
    //   sym == 0xF0 -> ZRL: advance index by 16, place no value, continue
    // otherwise: the run/size placement from the previous lesson.
    func decodeAC(block *[64]int, r *BitReader, ac *HuffTable) { }
checkpoint: Your AC loop handles end-of-block and long zero runs. Commit and stop here.
---

Two AC symbols are escapes from the ordinary run-then-value rule. **End-of-block**, symbol `0x00` (run 0, size 0), says every remaining coefficient in the block is zero: you stop decoding immediately and leave indices from the current position through 63 at zero. Because most blocks end in a long tail of zeros, EOB is what makes AC coding compact - one symbol collapses the whole tail.

**ZRL**, symbol `0xF0` (run 15, size 0), handles a zero run longer than a single run nibble can express. A run nibble maxes out at 15, but a real block can have more than 15 consecutive zeros before the next nonzero coefficient. ZRL skips **16** coefficients (the 15 from the run plus the position that would normally hold a value) and places nothing, and decoding continues. Chaining a ZRL before an ordinary pair is how the encoder spells, say, a run of 20 zeros. With EOB and ZRL in place, the AC decode loop is complete and can fill any legal block.
