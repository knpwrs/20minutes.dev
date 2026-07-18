---
project: build-a-vision-model
lesson: 19
title: Flatten
overview: A dense layer wants one flat vector, not a stack of channel grids. Today you flatten the two pooled channels from lesson 18 into a single vector, channel-major then row-major.
goal: Flatten the two pooled 2x2 channels from lesson 18 into one 8-element vector.
spec:
  scenario: Flattening a two-channel feature map into a vector
  status: failing
  lines:
    - kw: Given
      text: 'the two pooled 2 by 2 channels from lesson 18 - channel 0 reads 2, 2, 2, 2 in row-major order, channel 1 reads 0.5, 1.5, 0.5, 1.5'
    - kw: When
      text: 'the two channels are flattened into a single vector - all of channel 0 in row-major order first, then all of channel 1'
    - kw: Then
      text: 'the flattened vector has 8 entries: 2, 2, 2, 2, 0.5, 1.5, 0.5, 1.5, in exactly that order'
code:
  lang: go
  source: |
    // channel-major, then row-major within each channel
    var out []float64
    for c := range channels {
      for _, row := range channels[c] {
        out = append(out, row...)
      }
    }
checkpoint: You can turn any stack of pooled channels into the single flat vector a dense layer expects, in a fixed and now-pinned order. Commit and stop for today.
---

Every layer so far has kept the channel-row-column shape from lesson 14 intact - a conv layer changes the numbers and the channel count, ReLU changes the numbers, pooling shrinks the grid, but the shape stays three-dimensional. A dense layer, the next one in this network, does not work on grids at all: it wants one flat list of numbers.

**Flatten** is the fixed rule for making that list: walk the channels in order, and within each channel walk its rows top to bottom, each row left to right. The order matters because a dense layer's weights are matched position by position to this exact vector - swap the order here and every weight lesson 20 pins would be multiplying the wrong value. Channel 0's four pooled values come first, then channel 1's four, giving today's 8-entry vector.
