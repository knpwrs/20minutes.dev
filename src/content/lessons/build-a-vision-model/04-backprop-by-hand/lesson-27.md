---
project: build-a-vision-model
lesson: 27
title: conv2d backward
overview: A conv kernel is reused at every position it slides over, so its backward pass has to sum a contribution from each one. Today you derive all three conv gradients at once - the weights, the bias, and the input.
goal: Derive dConvW, dConvB and dInput for the conv layer from lesson 15, using the ReLU-backward output from lesson 26 as the upstream gradient.
spec:
  scenario: Backward pass through a correlation with a shared kernel
  status: failing
  lines:
    - kw: Given
      text: 'the upstream gradient from lesson 26 for both channels, the original 6 by 6 input from lesson 14, and the two kernels from lesson 15'
    - kw: When
      text: 'conv2d backward is derived - the gradient with respect to every kernel weight, the gradient with respect to each channel bias, and the gradient with respect to every input pixel'
    - kw: Then
      text: 'channel 0 bias gradient is about 0.24963, and channel 1 bias gradient is about 0.24963 as well'
    - kw: And
      text: 'channel 0 kernel gradient has 0 in its entire left column and about 0.24963 in its entire right column'
    - kw: And
      text: 'the input gradient is 0 at row 0, column 0 but about 0.74963 at row 0, column 1'
code:
  lang: go
  source: |
    // three chain-rule sums, one per gradient. dConvB: sum the upstream
    // gradient for a channel over every output position it touched. dConvW:
    // each weight is reused at every output position - sum upstream times
    // input across all of them. dInput: each input pixel fed several output
    // positions through several weights - sum every one of those contributions.
    // Both channels read the SAME input, so their input gradients add together.
    func conv2DBackward(dOut, input [][]float64, w [3][3]float64) (dW [3][3]float64, dB float64, dInput [][]float64) {
      // accumulate the three sums described above
      return
    }
checkpoint: You have derived the backward pass for the last and most reused layer in the network, closing the loop from loss all the way back to the original input pixels. Commit and stop for today.
---

Every other layer in this chapter used a parameter once per position - a dense weight touches one input, one output. A conv kernel is different: the same nine weights get reused at every single position the kernel slides over, so a change to one weight affects every output pixel at once. That means its gradient is not one chain-rule term but a sum over every output position that weight participated in.

The input gradient has the same shape of problem from the other direction: an interior input pixel was read by several different output positions, through several different kernel weights, on its way to becoming part of the result. Work out, for a single weight and a single input pixel, exactly which output positions and which kernel offsets connect it back to the upstream gradient before writing the sum. The bias is the gentlest of the three - it was added once per output pixel, so its gradient is just the upstream gradient totalled across the whole channel.
