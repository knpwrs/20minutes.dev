---
project: build-a-vision-model
lesson: 9
title: The Gaussian kernel
overview: Box blur weighs every neighbour equally. A Gaussian blur instead weighs each neighbour by how close it is, using the familiar bell curve of a normal distribution. Today you build that weighting and watch it pull the same edge pixel to a different value than the box blur from lesson 8 gave.
goal: Build a 3x3 Gaussian kernel with sigma 1.0, normalized so its nine weights sum to exactly 1, and confirm the blurred value it produces at the same edge pixel from lesson 8.
spec:
  scenario: A Gaussian-weighted blur
  status: failing
  lines:
    - kw: Given
      text: 'a 3x3 Gaussian kernel with sigma 1.0: raw weights from the Gaussian formula, then each divided by the total of all nine so they add to exactly 1'
    - kw: When
      text: the kernel is inspected
    - kw: Then
      text: 'the centre weight is about 0.20418, the four weights directly above, below, left and right of centre are about 0.123841 each, and the four corner weights are about 0.0751136 each'
    - kw: And
      text: the nine weights sum to exactly 1
    - kw: When
      text: 'the kernel is convolved with zero-padding to the same size (lesson 7) over the same 5 by 5 edge image from lesson 8'
    - kw: Then
      text: 'the centre pixel at column 2, row 2 blurs to about 62.073 - lower than the 73.333 the box blur gave in lesson 8, because the Gaussian puts more weight on the pixel itself and less on the far column of 200s'
code:
  lang: go
  source: |
    // raw weight at offset (dx, dy) before normalizing: the 2D Gaussian bump
    func gaussianRaw(dx, dy int, sigma float64) float64 {
      return math.Exp(-float64(dx*dx+dy*dy) / (2 * sigma * sigma))
    }
    // sum the nine raw weights, then divide each one by that sum
checkpoint: You have a second blur, this one weighted toward the centre pixel instead of uniform, and confirmed both its exact weights and the different value they give at the same edge pixel from lesson 8. Commit and stop for today.
---

A Gaussian kernel replaces box blur's flat weights with ones shaped like a bell curve centred on the middle cell: `exp(-(dx^2+dy^2) / (2*sigma^2))` for each offset `(dx, dy)` from the centre, using `sigma = 1.0`. Those raw values do not sum to 1 on their own, so the last step divides every entry by their total - the same normalising move you will meet again wherever weights need to add up to a whole.

The shape matters more than the exact numbers: the centre gets the largest weight, the four orthogonal neighbours get less, and the four diagonal corners, furthest away by Euclidean distance, get the least of all. Convolve it over lesson 8's edge image and the blurred centre pixel comes out lower than the box blur's, because a Gaussian leans more of its weight onto the pixel itself instead of spreading it uniformly across all nine neighbours.
