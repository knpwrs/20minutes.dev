---
project: build-a-jpeg-codec
lesson: 28
title: Decoding an MCU
overview: A scan is a run of MCUs, each holding several blocks interleaved by component. Today you decode a whole MCU, keeping each component's DC predictor independent.
goal: Decode all blocks of one MCU in component-interleaved order, with a separate DC predictor per component.
spec:
  scenario: Decoding one interleaved MCU
  status: failing
  lines:
    - kw: Given
      text: 'a 4:2:0 MCU whose four luma blocks encode DC differences +5, +2, 0, 0, and whose Cb and Cr blocks each encode DC difference +4, all predictors starting at 0'
    - kw: When
      text: the MCU is decoded in order (four Y blocks, then Cb, then Cr)
    - kw: Then
      text: "the luma blocks' DC values are 5, 7, 7, 7 as the luma predictor carries, and the Cb and Cr blocks' DC values are each 4"
    - kw: And
      text: "the chroma predictors are independent of luma - Cb's DC of 4 comes from its own predictor starting at 0, not from the luma chain"
code:
  lang: go
  source: |
    // a per-component decode view (distinct from the scan header's ScanComp):
    //   type mcuComp struct{ blocks int; dc, ac *HuffTable; pred int }
    // for each component in scan order, for each of its `blocks` blocks:
    //   block := decodeBlock(r, comp.dc, comp.ac, &comp.pred)
    // each component owns its own pred; luma decodes 4 blocks, chroma 1 each.
    func decodeMCU(r *BitReader, comps []mcuComp) [][64]int { }
checkpoint: You can decode a full interleaved MCU. Commit and stop here.
---

A scan is a sequence of **MCUs**, and each MCU is decoded by walking the components in scan order and, for each, decoding its `H*V` blocks with `decodeBlock`. For 4:2:0 that is four luma blocks, then one Cb block, then one Cr block - six blocks, in that exact interleaved order. The blocks come out still in zig-zag coefficient form; assembling them into pixels is a later chapter's job.

The subtlety is that each component carries its **own** DC predictor. Luma's predictor threads through all four of its blocks - differences `+5, +2, 0, 0` give DCs `5, 7, 7, 7` - while Cb and Cr each have a separate predictor that started at 0, so a Cb difference of `+4` yields a DC of 4 regardless of what luma did. Sharing one predictor across components is a bug that tints the whole image; the spec pins the independence. Looping `decodeMCU` across the MCU grid you computed in the frame chapter walks the entire scan.
