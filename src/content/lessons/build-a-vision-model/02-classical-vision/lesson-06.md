---
project: build-a-vision-model
lesson: 6
title: Convolution with a 3x3 kernel
overview: 'Every filter in this project is the same operation - a small grid of weights slid over the image. Today you build it, and settle the naming quirk that fixes the sign of everything downstream.'
goal: Slide a 3x3 kernel over a 3x3 patch of pixels, multiplying and summing, matching the pinned result of -6.
spec:
  scenario: Correlation vs convolution on a fixed patch
  status: failing
  lines:
    - kw: Given
      text: 'a 3x3 patch whose rows are 1 2 3, then 4 5 6, then 7 8 9'
    - kw: And
      text: 'a 3x3 kernel whose rows are 1 0 -1, then 1 0 -1, then 1 0 -1'
    - kw: When
      text: 'the kernel is placed over the patch, each kernel entry is multiplied by the pixel underneath it, and the nine products are summed - without flipping the kernel first'
    - kw: Then
      text: 'the result is -6'
    - kw: And
      text: 'flipping the kernel 180 degrees before that same multiply-and-sum instead gives 6 - this project uses the unflipped form throughout, matching what every ML framework calls a convolution'
code:
  lang: go
  source: |
    // multiply each kernel entry against the pixel it sits over, then sum -
    // do not assume convolution flips the kernel; work out which direction
    // matches the spec's -6
    func correlate3x3(patch [3][3]uint8, k [3][3]float64) float64 {
      var sum float64
      // sum += k[ky][kx] * float64(patch[ky][kx]), for each of the 9 cells
      return sum
    }
checkpoint: 'You have implemented convolution exactly as this project defines it: correlation, kernel unflipped. That single decision fixes the sign of every filter for the rest of this chapter. Commit and stop for today.'
---

A **kernel** is a small grid of weights. To apply it at a pixel, place it over that pixel's 3x3 neighbourhood, multiply each kernel entry by the pixel underneath it, and add up the nine products. Slide that across a whole image and you have image processing's one core operation - a blur, a sharpen and an edge detector are all this same operation with a different kernel.

The name for that operation is where it gets confusing. The textbook definition of *convolution* first flips the kernel 180 degrees, because true convolution is commutative and correlation is not. PyTorch, TensorFlow and every other framework's `conv2d`, though, skip that flip entirely - what they compute is correlation, kept under the older name. Build today's multiply-and-sum honestly against the patch above and check which of the two numbers, `-6` or `6`, it lands on; that tells you which convention this project, and every framework you will ever use, actually means.
