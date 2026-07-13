---
project: build-a-jpeg-codec
lesson: 15
title: The SOF0 frame header
overview: The SOF0 segment declares the image itself - its precision, dimensions, and how many color components it has. Today you read that header, giving the decoder the picture's shape.
goal: Read a baseline SOF0 header's sample precision, image height, image width, and component count.
spec:
  scenario: Reading the frame header
  status: failing
  lines:
    - kw: Given
      text: 'a SOF0 payload beginning with the bytes 0x08, 0x00,0x10, 0x00,0x10, 0x03'
    - kw: When
      text: the frame header is read
    - kw: Then
      text: 'the precision is 8 bits, the height is 16, the width is 16, and there are 3 components'
    - kw: And
      text: 'height and width are two-byte big-endian values'
code:
  lang: go
  source: |
    // SOF0 (0xC0) payload starts:
    //   1 byte  precision (8 for baseline)
    //   2 bytes height (BE)   2 bytes width (BE)
    //   1 byte  number of components (1=gray, 3=YCbCr)
    //   then 3 bytes per component (next lesson)
    type Frame struct{ Precision byte; Height, Width, NumComp int }
checkpoint: You can read the image precision, size, and component count. Commit and stop here.
---

**SOF0** (Start Of Frame, baseline DCT, marker `0xC0`) is where the image stops being an abstract stream of tables and gains real dimensions. Its header opens with a **precision** byte, which for baseline JPEG is always `8` (eight bits per sample). Then come the **height** and **width**, two big-endian 16-bit values, and a **component count**: `1` for a grayscale image, `3` for the usual luminance-plus-two-chrominance color image.

The `0` in SOF0 is what marks this as **baseline sequential** - the only mode this codec targets. Other frame markers exist (`0xC1` extended sequential, `0xC2` progressive, `0xC3` lossless) and a real decoder would reject or specially handle them; here, meeting anything but `0xC0` is out of scope. With the size known, the decoder can compute how many blocks and MCUs the scan will contain, which is exactly what the next lessons work out from the per-component sampling factors.
