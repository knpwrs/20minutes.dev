---
project: build-a-jpeg-codec
lesson: 37
title: Assembling the image
overview: Every decoder stage is now built - time to wire them into one pass that turns decoded planes into an RGB image. Today you assemble the full image, completing the decoder.
goal: Combine the luma and upsampled chroma planes into an RGB image by converting every pixel, cropping to the declared size.
spec:
  scenario: Assembling planes into an RGB image
  status: failing
  lines:
    - kw: Given
      text: 'a decoded MCU whose luma plane is all 128 and whose (upsampled) Cb and Cr planes are all 128, for a 16-by-16 region'
    - kw: When
      text: the planes are assembled into RGB
    - kw: Then
      text: 'every pixel of the 16-by-16 region is (128, 128, 128)'
    - kw: And
      text: 'the image is cropped to the frame''s declared width and height, discarding any padding samples beyond the edge'
code:
  lang: go
  source: |
    // planeW is the padded plane stride (MCU tiling overshoots the frame edge),
    // so cropping to w,h drops the padding samples.
    // for each pixel (x,y) up to width,height:
    //   y_,cb,cr := luma[y*planeW+x], cbPlane[..], crPlane[..]  // chroma upsampled
    //   r,g,b := ycbcrToRGB(y_, cb, cr)
    // pack into the RGB image; ignore samples past width/height.
    func assemble(luma, cb, cr []byte, planeW, w, h int) *Image { }
checkpoint: Your decoder turns decoded planes into a cropped RGB image. The decoder is complete - commit and stop here.
---

This is where the decoder becomes whole. Each component's plane is assembled from its blocks; the chroma planes are upsampled to full resolution; and then, pixel by pixel, the aligned `Y`, `Cb`, and `Cr` are run through the color conversion to produce `R`, `G`, `B`. A region that decoded to neutral samples - luma and chroma all 128 - comes out as flat gray `(128,128,128)`, the sanity check that every plane lines up.

The final detail is **cropping**. Because MCUs tile in whole 8-or-16-pixel steps, the decoded planes can extend past the image's true width and height; those extra samples were encoder padding and are simply dropped when packing the final image. With that, the decoder is finished: signature and marker walk, table and frame parsing, the full entropy scan, dequantize, inverse DCT, level shift, upsample, and color conversion, all cooperating to turn a baseline JPEG into pixels. What remains in the project is the mirror image - an encoder that runs this pipeline backward.
