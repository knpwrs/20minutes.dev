---
project: build-a-vision-model
lesson: 25
title: Max-pool backward
overview: Max pooling threw away three of every four values, so its backward pass must send the gradient back to exactly the one position that survived. Today you route it there using the argmax lesson 18 recorded.
goal: Route the gradient from lesson 24, unflattened per the convention from lesson 19, back through the argmax positions recorded in lesson 18.
spec:
  scenario: Routing a pooled gradient back to its single winning input
  status: failing
  lines:
    - kw: Given
      text: 'the dx values from lesson 24, unflattened into two 2 by 2 grids by reversing lesson 19 - channel 0 reads about -0.74963, 0.25037 in row 0 and about 0.87444, -0.12556 in row 1, channel 1 reads about -0.34361, 0.15639 in row 0 and about 0.46842, -0.03158 in row 1'
    - kw: And
      text: 'the argmax position lesson 18 recorded for every pooling window in each channel'
    - kw: When
      text: 'each pooled gradient value is written to just its window argmax position in a 4 by 4 grid, and every other position stays at 0'
    - kw: Then
      text: 'channel 0 row 0 reads 0, about -0.74963, about 0.25037, 0 and row 2 reads 0, about 0.87444, about -0.12556, 0 - the four winners, two from the top windows and two from the bottom'
    - kw: And
      text: 'channel 1 row 0 reads about -0.34361, 0, about 0.15639, 0 and row 2 reads about 0.46842, 0, about -0.03158, 0'
    - kw: And
      text: 'in both channels rows 1 and 3 are entirely 0, and so are columns 0 and 3 of channel 0 - no window ever chose a position in a row or column that lost every one of its ties'
code:
  lang: go
  source: |
    // each pooled gradient goes to exactly the position lesson 18 recorded
    // as the argmax for that window (the Argmax type from lesson 18); every
    // other position starts, and stays, at 0 - just a scatter by that index
    func maxPoolBackward(dPool [][]float64, argmax [][]Argmax, h, w int) [][]float64 {
      dInput := make([][]float64, h)
      // dInput[argmax[oy][ox].Row][argmax[oy][ox].Col] += dPool[oy][ox]
      return dInput
    }
checkpoint: Gradient now flows back through pooling to exactly the input pixel that won each window, leaving every losing position untouched at 0. Commit and stop for today.
---

Max pooling forward looked at four values and kept one, discarding the other
three completely. Backward through it has to undo that honestly: whatever
gradient arrives at a pooled output belongs entirely to the single input
position that produced it, and the three positions that lost get none of it at
all, not even a share.

That is why lesson 18 recorded an argmax alongside every pooled value - today is
simply reading it back. There is no calculus left to do here, unlike a dense
layer: the gradient is not split, scaled or combined, only copied to one recorded
coordinate per window and left at `0` everywhere else. Notice the order you are
working in, because it is the whole shape of this chapter. The forward pass ran
convolution, then ReLU, then pooling; going backwards you meet them in reverse,
so pooling comes first - today - and ReLU is tomorrow.
