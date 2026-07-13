---
project: build-a-jpeg-codec
lesson: 27
title: Decoding a whole block
overview: Now the DC and AC pieces combine into one call that decodes a full 64-coefficient block. Today you assemble them, producing your first complete block of coefficients.
goal: Decode a full block - one DC coefficient then AC coefficients until end-of-block - into a 64-entry array in zig-zag order.
spec:
  scenario: Decoding one complete block
  status: failing
  lines:
    - kw: Given
      text: 'a scan encoding one block: DC difference +3 (predictor 0), then an AC pair (run 0, size 2) with value +3 at index 1, then end-of-block'
    - kw: When
      text: the block is decoded
    - kw: Then
      text: 'the 64-entry block in zig-zag order has entry 0 equal to 3 (the DC) and entry 1 equal to 3, with entries 2 through 63 all zero'
    - kw: And
      text: 'the entries stay in zig-zag order - they are not un-zig-zagged into a grid yet'
code:
  lang: go
  source: |
    // decodeBlock: start a zeroed [64]int in zig-zag order.
    //   block[0] = decodeDC(...)
    //   decodeAC(&block, ...)  // fills indices 1..63 until EOB
    // returns the block still in zig-zag order (dequantize/un-zig-zag come later).
    func decodeBlock(r *BitReader, dc, ac *HuffTable, pred *int) [64]int { }
checkpoint: You can decode a full block of coefficients from the scan. Commit and stop here.
---

This is where the chapter's pieces click together. A block is one **DC** coefficient followed by the **AC** loop running until end-of-block, producing a 64-entry array. Entry 0 is the DC; entries 1 through 63 are the AC coefficients laid out in the order the run-length loop placed them. For the pinned example the DC decodes to 3 and a single AC pair puts 3 at index 1, with the EOB zeroing the rest, so the block is `[3, 3, 0, 0, ...]`.

Two things to keep straight. First, the block stays in **zig-zag order** - these 64 values are still the diagonal sequence, not a spatial grid; the un-zig-zag and dequantize happen in the next chapter, deliberately kept separate. Second, `decodeBlock` threads the DC predictor through, so calling it repeatedly for the blocks of a component naturally carries the running DC. That repeated call, interleaved across components, is how a whole MCU decodes - which is the next lesson.
