---
project: build-a-jpeg-codec
lesson: 16
title: Component sampling factors
overview: Each component in the frame declares how finely it is sampled and which quantization table it uses. Today you read those three bytes per component, the data that defines chroma subsampling.
goal: Read each component's id, horizontal and vertical sampling factors, and quantization table selector.
spec:
  scenario: Reading a component's sampling spec
  status: failing
  lines:
    - kw: Given
      text: 'three components with bytes (0x01,0x22,0x00), (0x02,0x11,0x01), (0x03,0x11,0x01)'
    - kw: When
      text: each component spec is read
    - kw: Then
      text: 'component 1 has id 1, horizontal sampling 2, vertical sampling 2, and quant table 0'
    - kw: And
      text: 'components 2 and 3 each have horizontal and vertical sampling 1 and use quant table 1'
code:
  lang: go
  source: |
    // per component: id byte, then (H<<4 | V), then quant-table selector Tq.
    // The example is 4:2:0 - luma sampled 2x2, chroma 1x1.
    type Component struct{ ID, H, V, Tq byte }
checkpoint: You can read every component's sampling factors and quant selector. Commit and stop here.
---

Each component in the frame is described by **three bytes**: a component **id** (1 is luminance Y, 2 is Cb, 3 is Cr by convention), a byte packing the **horizontal** sampling factor in its high nibble and the **vertical** factor in its low nibble, and a **quantization table selector** naming which DQT table dequantizes this component. The example `01 22 00` says component 1 is sampled `2x2` and uses quant table 0, while the chroma components are sampled `1x1` and use table 1.

Those sampling factors are how JPEG expresses **chroma subsampling**. Luma at `2x2` and chroma at `1x1` means the image stores four luma blocks for every one Cb and one Cr block - the familiar 4:2:0 layout that halves chroma resolution in each direction because the eye is far more sensitive to brightness than color. When both factors are `1x1` for every component you have 4:4:4, full-resolution color. These numbers drive the entire MCU geometry you work out next.
