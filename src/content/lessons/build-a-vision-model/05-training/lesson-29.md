---
project: build-a-vision-model
lesson: 29
title: A synthetic dataset
overview: A network needs labeled data, and downloading a dataset is a dependency this project skips. Today you generate eight images by formula, each a vertical or horizontal edge at a distinct position.
goal: Generate all eight training samples from a fixed formula, in order, and confirm the two ends of the sequence.
spec:
  scenario: Generating dataset samples by formula
  status: failing
  lines:
    - kw: Given
      text: 'the formula label = i mod 2, k = i divided by 2 (integer division), edge = k + 1, applied to build a 1-channel 6 by 6 image for sample index i'
    - kw: When
      text: sample i=0 is generated
    - kw: Then
      text: 'label is 0 (a vertical edge) and edge is 1 - every row reads 0, 1, 1, 1, 1, 1'
    - kw: When
      text: sample i=7 is generated
    - kw: Then
      text: 'label is 1 (a horizontal edge) and edge is 4 - rows 0 through 3 are entirely 0 and rows 4 and 5 are entirely 1'
    - kw: And
      text: 'the eight samples i=0 through i=7 are consumed in that exact order, never shuffled, and each is pixel-distinct within its class since edge grows with i'
code:
  lang: go
  source: |
    // label = i%2 picks the axis; k = i/2 and edge = k+1 pick the position
    func GenerateSample(i int) (image [][]float64, label int) {
      label = i % 2
      image = make([][]float64, 6)
      for y := range image {
        image[y] = make([]float64, 6)
        // set image[y][x] = 1 when x >= edge (label 0) or y >= edge (label 1)
      }
      return
    }
checkpoint: You can regenerate the entire training set from nothing but an index, and have confirmed both a vertical and a horizontal sample against the formula by hand. Commit and stop for today.
---

Every network in this project so far has trained on nothing, because there was nothing to train on. A **synthetic dataset** fixes that without a download or a label file: compute the label and the image straight from the sample index. `label = i mod 2` alternates vertical and horizontal; `k = i / 2` groups two consecutive indices together; `edge = k + 1` slides the edge one column or row further for each group. Index 0 is a vertical edge at column 1, index 1 a horizontal edge at row 1, index 2 a vertical edge at column 2, and so on up through index 7.

Nothing here is random, and that is the entire point. A dataset you can compute by hand is a dataset you can debug - if a trained network gets sample 3 wrong, you can write out exactly what sample 3 is and look straight at it. Generate all eight in order and keep them in that order; nothing downstream shuffles them.
