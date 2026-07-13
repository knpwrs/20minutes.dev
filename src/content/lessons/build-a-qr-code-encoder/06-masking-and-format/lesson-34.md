---
project: build-a-qr-code-encoder
lesson: 34
title: Penalty rule 3 - finder-like patterns
overview: 'The third rule punishes any run that mimics the finder pattern''s distinctive 1:1:3:1:1 signature, which could fool a scanner into seeing a finder where there is none. Today you write it.'
goal: 'Score a grid by penalizing finder-like patterns in any row or column.'
spec:
  scenario: 'Finder-like sequences are penalized'
  status: failing
  lines:
    - kw: Given
      text: 'penalty rule 3: each occurrence of the 11-module pattern dark-light-dark-dark-dark-light-dark next to four light modules scores 40'
    - kw: When
      text: 'a line containing 1,0,1,1,1,0,1,0,0,0,0 is scanned'
    - kw: Then
      text: 'that occurrence contributes 40'
    - kw: And
      text: 'the reversed pattern 0,0,0,0,1,0,1,1,1,0,1 also scores 40, and both orientations are checked in every row and every column'
code:
  lang: go
  source: |
    // Slide an 11-wide window; match either orientation.
    var p1 = []int8{1,0,1,1,1,0,1,0,0,0,0}
    var p2 = []int8{0,0,0,0,1,0,1,1,1,0,1}
    // for each row and column, for each window of 11:
    //   if it equals p1 or p2, add 40
checkpoint: 'You can score a grid on finder-like patterns. Commit and stop here.'
---

The finder pattern is recognized by its **1:1:3:1:1** dark-light ratio, and a scanner hunts for exactly that signature. If the data region accidentally produces the same sequence, the scanner might mistake it for a finder and misalign. **Rule 3** guards against this: wherever the 7-module core `1,0,1,1,1,0,1` appears with **four light modules** on one side - the 11-module patterns `1,0,1,1,1,0,1,0,0,0,0` or its reverse `0,0,0,0,1,0,1,1,1,0,1` - it scores a hefty **40**.

You detect it by sliding an 11-wide window along every row and every column and matching either orientation. The large penalty reflects how badly a false finder can break scanning, so this rule often dominates the choice of mask. One rule remains - the overall dark/light balance - and then you total all four.
