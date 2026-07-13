---
project: build-a-qr-code-encoder
lesson: 32
title: Penalty rule 1 - runs
overview: 'To pick the best mask, QR scores each masked grid with four penalty rules and takes the lowest total. The first rule punishes long runs of one color in a row or column. Today you write it.'
goal: 'Score a line by penalizing every run of five or more same-colored modules.'
spec:
  scenario: 'Long same-color runs are penalized'
  status: failing
  lines:
    - kw: Given
      text: 'penalty rule 1: each run of 5 or more same-colored modules in a row or column scores 3 + (runLength - 5)'
    - kw: When
      text: 'a run of 7 identical modules is scored'
    - kw: Then
      text: 'it contributes 5 (that is 3 + (7 - 5))'
    - kw: And
      text: 'a line of 5 dark then 5 light modules scores 6 (two runs of exactly 5, each worth 3), and the full rule sums this over all 21 rows and all 21 columns'
code:
  lang: go
  source: |
    // Walk each row and column; a run of length L >= 5 adds 3+(L-5).
    func rule1Line(line []int8) int {
      s, run := 0, 1
      for i := 1; i < len(line); i++ {
        if line[i] == line[i-1] { run++ } else {
          if run >= 5 { s += 3 + (run - 5) }
          run = 1
        }
      }
      if run >= 5 { s += 3 + (run - 5) }
      return s
    }
checkpoint: 'You can score a grid on run length. Commit and stop here.'
---

The four penalty rules are the standard's way of turning "which mask looks cleanest" into a number, and you pick the mask with the **lowest** total penalty. **Rule 1** targets long monochrome runs, which are hard for a scanner to count across. Any run of **5 or more** identical modules along a row or a column scores `3 + (runLength - 5)`: exactly five costs 3, six costs 4, seven costs 5, and so on, with no penalty for runs of four or fewer.

You compute it line by line - each of the 21 rows and each of the 21 columns - and sum. A run of seven scores 5; a line that is five dark then five light has two qualifying runs and scores `3 + 3 = 6`. Getting the "5 or more, then +1 per extra" boundary exactly right is what makes the total match the reference, so pin it here. Three more rules follow, each catching a different kind of ugliness, before you total them and choose.
