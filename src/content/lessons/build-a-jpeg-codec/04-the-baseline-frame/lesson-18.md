---
project: build-a-jpeg-codec
lesson: 18
title: Blocks within an MCU
overview: Inside each MCU, every component contributes a fixed number of 8-by-8 blocks in a fixed order. Today you work out that count per component, the interleave pattern the scan decoder walks.
goal: Compute how many 8-by-8 blocks each component contributes to one MCU, and the total blocks per MCU.
spec:
  scenario: Counting blocks per MCU
  status: failing
  lines:
    - kw: Given
      text: 'a 4:2:0 frame - component 1 sampled 2x2, components 2 and 3 sampled 1x1'
    - kw: When
      text: the blocks per MCU are counted
    - kw: Then
      text: 'component 1 contributes 4 blocks, components 2 and 3 contribute 1 block each, for 6 blocks per MCU'
    - kw: And
      text: 'a 4:4:4 frame (all components 1x1) contributes 1 block each, 3 blocks per MCU'
code:
  lang: go
  source: |
    // a component contributes H*V blocks to each MCU, laid out
    // in row-major order within its H-by-V grid.
    // total = sum over components of H*V.
    func blocksPerMCU(comps []Component) (perComp []int, total int) { }
checkpoint: You can count each component's blocks in an MCU. Commit and stop here.
---

Within one MCU, a component contributes exactly `H*V` blocks - its horizontal factor times its vertical factor - arranged as an `H`-by-`V` grid. For 4:2:0 luma (`2x2`) that is four 8-by-8 blocks covering the MCU's 16-by-16 luma area, while each chroma component (`1x1`) contributes a single block covering the whole MCU at half resolution. That makes **six blocks per MCU**: four Y, one Cb, one Cr.

The order matters enormously for the scan decoder. Blocks are interleaved **component by component, each in row-major order**: all of component 1's blocks first (top-left, top-right, bottom-left, bottom-right for a `2x2`), then component 2's, then component 3's, then the next MCU. That fixed sequence is the exact order the entropy decoder will read blocks in, and each component keeps its own DC predictor across the whole scan. With the block layout pinned down, the frame is fully understood and you are ready to crack open the entropy scan.
