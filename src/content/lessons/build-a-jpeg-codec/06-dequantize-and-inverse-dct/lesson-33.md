---
project: build-a-jpeg-codec
lesson: 33
title: Level shift and clamp
overview: The inverse DCT produces samples centered on zero, but pixels run 0 to 255. Today you add the 128 level shift, round, and clamp to finish a block of real sample values.
goal: Convert inverse-DCT output to 8-bit samples by adding 128, rounding, and clamping to the range 0 to 255.
spec:
  scenario: Level-shifting and clamping samples
  status: failing
  lines:
    - kw: Given
      text: 'inverse-DCT sample values of 0.0, 64.0, -140.0, and 140.0'
    - kw: When
      text: each is level-shifted and clamped
    - kw: Then
      text: '0.0 becomes 128 and 64.0 becomes 192'
    - kw: And
      text: '-140.0 clamps to 0 (below range) and 140.0 clamps to 255 (above range)'
code:
  lang: go
  source: |
    // sample = round(x) + 128, then clamp to [0, 255].
    func levelShift(x float64) byte {
      v := int(math.Round(x)) + 128
      // clamp v to 0..255
    }
checkpoint: You can turn inverse-DCT output into 8-bit samples. Commit and stop here.
---

The encoder subtracted 128 from every sample before transforming, centering the data on zero so the DCT works on signed values. To undo that, the decoder adds **128** back after the inverse DCT. A sample of `0.0` becomes the mid-gray `128`, and `64.0` becomes `192`. Rounding to the nearest integer first keeps the reconstruction as accurate as the lossy pipeline allows.

The **clamp** matters because the reconstructed values can legitimately overshoot the valid range - quantization error and the transform's ringing can push a sample below 0 or above 255 even though the original pixel was in range. Without a clamp those wrap around into garbage; with it, `-140.0` shifts to `-12` and pins to `0`, while `140.0` shifts to `268` and pins to `255`. Pinning both edges guarantees the clamp is there. These bytes are the component's spatial samples - luma or chroma - ready for color conversion and assembly in the next chapter.
