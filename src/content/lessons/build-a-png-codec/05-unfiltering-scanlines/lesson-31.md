---
project: build-a-png-codec
lesson: 31
title: Scanlines and bytes per pixel
overview: The inflated bytes are not pixels yet - they are filtered scanlines, each row prefixed by one filter-type byte. Today you work out the row layout and the bytes-per-pixel value every filter needs.
goal: Compute the bytes per pixel and the filtered stride of a scanline from the image header.
spec:
  scenario: Sizing a filtered scanline
  status: failing
  lines:
    - kw: Given
      text: 'an image that is 3 pixels wide, color type 6 (RGBA) at bit depth 8'
    - kw: When
      text: the layout is computed
    - kw: Then
      text: 'bytes per pixel is 4 and each filtered row is 13 bytes: 1 filter-type byte plus 3 pixels times 4 bytes'
    - kw: And
      text: 'bytes per pixel is the channel count times bit depth divided by 8, rounded up, and never less than 1'
code:
  lang: go
  source: |
    // channels: gray=1, rgb=3, palette=1, gray+alpha=2, rgba=4.
    // bpp = ceil(channels * bitDepth / 8), min 1.
    // filtered stride = 1 + ceil(width * channels * bitDepth / 8)
    func bytesPerPixel(colorType, bitDepth int) int { }
checkpoint: You can size a filtered scanline and know its bytes per pixel. Commit and stop here.
---

The bytes coming out of `Inflate` are organized as **scanlines**, one per image row, and each row begins with a single **filter-type byte** that says how that row was transformed before compression. Filtering makes pixel data more compressible by storing differences from neighbors rather than raw values, and it is undone one row at a time. Before you can undo it you need two numbers: the **bytes per pixel** (bpp) and the **stride**, the total byte length of a filtered row.

Bytes per pixel is the channel count times the bit depth over 8, rounded up and floored at 1 - so 8-bit RGBA is 4, and a 1-bit grayscale pixel still counts as 1 byte for the filter's stepping purposes. The stride is `1 + row-data-bytes`: the leading filter byte plus the packed samples. These values drive every filter that follows, because Sub and Paeth reach back exactly `bpp` bytes to find the pixel to the left. Get them right and the reconstruction filters have a solid frame to work in.
