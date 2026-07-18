---
project: build-a-vision-model
lesson: 16
title: Several output channels
overview: A conv layer usually produces more than one feature map at once, each from its own independent kernel over the same input. Today you add a second output channel alongside the one lesson 15 built.
goal: Correlate a second kernel, rows 0 0 0 then 0 1 0 then 0 0 0 with bias 0.5, over the same input and stack it as a second output channel.
spec:
  scenario: Two independent kernels producing two output channels
  status: failing
  lines:
    - kw: Given
      text: 'the 6 by 6 input from lesson 14, the kernel and bias from lesson 15 for channel 0, and a second kernel for channel 1, rows 0 0 0, then 0 1 0, then 0 0 0, with bias 0.5'
    - kw: When
      text: 'each kernel is correlated independently across the whole input with valid padding, and the two 4x4 results are stacked as channel 0 and channel 1 of one output'
    - kw: Then
      text: 'the output has 2 channels, each 4 by 4'
    - kw: And
      text: 'channel 1, row 0 reads 0.5, 0.5, 1.5, 1.5'
    - kw: And
      text: 'channel 0 is unchanged from the result lesson 15 produced'
code:
  lang: go
  source: |
    // one call to lesson 15's conv3x3Valid per output channel, each with its
    // own kernel and bias; the two 4x4 results become channel 0 and channel 1
    out := make([][4][4]float64, len(kernels))
    for co := range kernels {
      out[co] = conv3x3Valid(in, kernels[co], biases[co])
    }
checkpoint: The conv layer now produces two independent channels from the same input, and you can see each one is nothing more than lesson 15 run again with different weights. Commit and stop for today.
---

Nothing about lesson 15's correlation changes here - a conv layer just runs it several times over the same input, once per output channel, each with its own 3x3 kernel and its own bias. A network is free to give every one of those kernels a different job: channel 0's kernel above still measures left-right change the way Sobel did, while channel 1's picks out the centre pixel of its window untouched.

The output of a conv layer with several channels is just another feature map, in the same channel-then-row-then-column shape lesson 14 defined, only now with `Cout` channels instead of 1. Nothing downstream needs to know how many kernels produced it or what each one does; it is still a stack of grids, ready for the next layer.
