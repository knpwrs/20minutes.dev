---
project: build-a-jpeg-codec
lesson: 17
title: MCU geometry
overview: The sampling factors set the size of a Minimum Coded Unit - the block of pixels the scan encodes at a time. Today you compute the MCU size and how many MCUs tile the image.
goal: Compute the MCU pixel size from the maximum sampling factors and the number of MCUs across and down the image.
spec:
  scenario: Computing MCU dimensions
  status: failing
  lines:
    - kw: Given
      text: 'a 16-by-16 image with maximum sampling factors Hmax 2 and Vmax 2'
    - kw: When
      text: the MCU geometry is computed
    - kw: Then
      text: 'each MCU is 16 by 16 pixels, and the image is 1 MCU across and 1 MCU down'
    - kw: And
      text: 'a 17-pixel-wide image would be 2 MCUs across (the count rounds up)'
code:
  lang: go
  source: |
    // Hmax, Vmax = max sampling factors over all components.
    // MCU is (8*Hmax) by (8*Vmax) pixels.
    // mcusAcross = ceil(width  / (8*Hmax))
    // mcusDown   = ceil(height / (8*Vmax))
    func mcuGeometry(w, h, hmax, vmax int) (mcuW, mcuH, across, down int) { }
checkpoint: You can compute an image's MCU grid. Commit and stop here.
---

The scan does not process the image pixel by pixel or even block by block; it processes one **MCU** (Minimum Coded Unit) at a time. An MCU is the smallest rectangle that contains a whole number of blocks from every component. Its size in pixels is `8*Hmax` wide by `8*Vmax` tall, where `Hmax` and `Vmax` are the largest sampling factors across all components. For 4:2:0, `Hmax` and `Vmax` are both 2, so an MCU is 16 by 16 pixels.

The number of MCUs is the image size divided by the MCU size, **rounded up** - the last row and column of MCUs may spill past the image edge, and those extra samples are encoded and then discarded on decode. That ceiling division is why a 17-pixel-wide 4:2:0 image needs 2 MCUs across even though the second is mostly padding. Getting this count right is essential: it is exactly how many times the scan loop runs.
