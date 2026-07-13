---
project: build-a-jpeg-codec
lesson: 24
title: The DC coefficient
overview: A block's DC coefficient is stored as a difference from the previous block's DC in the same component. Today you decode it and carry the predictor forward across two blocks.
goal: Decode each block's DC coefficient as the previous DC plus a Huffman-coded, extended difference, carrying the predictor across blocks.
spec:
  scenario: Decoding DC coefficients with a predictor
  status: failing
  lines:
    - kw: Given
      text: 'a scan for one component whose first block encodes DC difference +3 and whose second block encodes DC difference +1, with the predictor starting at 0'
    - kw: When
      text: the two blocks' DC coefficients are decoded in order
    - kw: Then
      text: "the first block's DC is 3 and the second block's DC is 4"
    - kw: And
      text: 'the predictor carried into the second block is the first block''s DC (3), not zero'
code:
  lang: go
  source: |
    // per block: t := decodeSymbol(r, dcTable)   // category
    //            diff := 0; if t != 0 { diff = receiveExtend(r, t) }
    //            dc := pred + diff
    //            pred = dc                         // carry for next block
    func decodeDC(r *BitReader, dc *HuffTable, pred *int) int { }
checkpoint: You can decode DC coefficients with a running predictor. Commit and stop here.
---

The DC coefficient - the block's average brightness - changes slowly from one block to the next, so JPEG stores only the **difference** from the previous block's DC in the same component. Decoding a DC is two steps: decode a Huffman symbol to get the magnitude **category** `t`, then, if `t` is nonzero, receive-and-extend `t` bits to get the signed **difference**. The block's actual DC is the running **predictor** plus that difference, and the predictor is then updated to this DC for the next block.

The predictor is **per component** and it carries across the entire scan (until a restart marker resets it, which you handle at the end of the chapter). So the first block, with the predictor at its initial 0 and a difference of +3, has DC 3; the second block, with the predictor now 3 and a difference of +1, has DC 4. Forgetting to carry the predictor - decoding each DC as if the predictor were always zero - is a classic bug that makes the whole image drift, so the spec pins the carry explicitly across two blocks.
