---
project: build-a-vision-model
lesson: 14
title: A feature map
overview: A feature map extends the image type from lesson 1 in two ways at once - values are floating point instead of a byte, and more than one can be stacked as channels. Today you build that type.
goal: Build a 1-channel 6 by 6 feature map holding a vertical edge and read pixels back through it.
spec:
  scenario: Building a float, multi-channel feature map
  status: failing
  lines:
    - kw: Given
      text: 'a feature map with 1 channel, 6 rows and 6 columns'
    - kw: And
      text: 'the value at column x, row y is 0 if x is less than 3, and 1 otherwise'
    - kw: When
      text: the map is inspected
    - kw: Then
      text: 'it holds exactly 1 channel'
    - kw: And
      text: 'channel 0, row 0 reads 0, 0, 0, 1, 1, 1'
    - kw: And
      text: 'channel 0, row 5 reads the same 0, 0, 0, 1, 1, 1 - every row is identical, since the edge is vertical'
code:
  lang: go
  source: |
    // like the flat Image from lesson 1, but float-valued and channel-stacked
    type FeatureMap struct {
      Channels, Height, Width int
      Data                    [][][]float64 // Data[channel][row][col]
    }
checkpoint: You have the type every layer in this chapter reads and writes, and can build one with a known pattern in it. Commit and stop for today.
---

Every layer from here on reads a grid of numbers and writes a grid of numbers back, and both grids can have more than one channel - a colour image starts with three, and a convolution can produce as many as it likes. A **feature map** is that shape made concrete: not one grid but a small stack of them, each the same height and width, indexed by channel first.

The other change from lesson 1 is the pixel type itself. An `Image` held bytes clamped to 0 through 255, which was the right choice for something you look at. A feature map holds arbitrary floating point numbers, because the values a convolution or a dense layer produce are not brightnesses any more - they are signals a network is free to scale however training finds useful. Today's map is small and hand built, but it is exactly the shape every conv, pooling and dense layer in this chapter will pass between them.
