---
project: build-a-jpeg-codec
lesson: 35
title: Placing a block in its plane
overview: Each decoded 8-by-8 sample block belongs at a specific spot in its component's sample plane. Today you write a block into the plane at the right pixel offset, the indexing that reassembles a component.
goal: Copy an 8-by-8 sample block into a component's sample plane at the pixel offset given by its block row and column.
spec:
  scenario: Writing a block into the sample plane
  status: failing
  lines:
    - kw: Given
      text: 'a 16-wide sample plane and an 8-by-8 block to place at block column 1, block row 0'
    - kw: When
      text: the block is copied in
    - kw: Then
      text: 'the block''s sample (0,0) lands at plane pixel (x=8, y=0), and its sample (7,7) lands at plane pixel (x=15, y=7)'
    - kw: And
      text: 'a block at block column 0, block row 1 starts at plane pixel (x=0, y=8)'
code:
  lang: go
  source: |
    // block (bx,by) covers plane pixels x in [bx*8, bx*8+7], y in [by*8, by*8+7].
    //   plane[(by*8+row)*planeW + (bx*8+col)] = block[row*8+col]
    func placeBlock(plane []byte, planeW, bx, by int, block [64]byte) { }
checkpoint: You can assemble decoded blocks into a component plane. Commit and stop here.
---

A component's image is a grid of 8-by-8 blocks, and each decoded block has to be written to the correct rectangle of that component's **sample plane**. A block at block-column `bx`, block-row `by` covers plane pixels from `bx*8` to `bx*8+7` horizontally and `by*8` to `by*8+7` vertically. So the block at block-column 1, block-row 0 fills the plane's second 8-pixel column band, starting at pixel `(8,0)`.

This indexing is the bridge from the per-block world of the DCT to the per-pixel world of the image. For a component sampled at `HxV`, its blocks tile a plane that is `H*8` wide and `V*8` tall per MCU; laying them out with this offset math reconstructs the full luma plane and each chroma plane. The chroma planes are smaller than the image when subsampled, which is why the next lesson upsamples them before color conversion.
