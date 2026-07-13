---
project: build-a-bloom-filter
lesson: 18
title: The minimum beats a colliding row
overview: The reason to keep several rows instead of one is robustness. A collision inflates a rare item's count in one row, but a different row stays clean, and the minimum ignores the inflated one. Today you construct exactly that rescue.
goal: Show that the row minimum recovers a true count even when one row is inflated by a collision.
spec:
  scenario: A collision in one row is overruled by the minimum
  status: failing
  lines:
    - kw: Given
      text: 'a fresh NewCountMin(3, 8) after adding "the" five times and "cherry" once, where "cherry" (columns 0, 5, 2) and "the" (columns 4, 7, 2) collide in row 2 at column 2'
    - kw: When
      text: 'cherry is estimated'
    - kw: Then
      text: 'its three row counters read 1, 1, and 6 - row 2 is inflated to 6 by the collision with "the"'
    - kw: And
      text: 'Estimate("cherry") is 1 and Estimate("the") is 5 - the minimum discards the inflated row 2 cell (6) for both items and recovers each true count'
code:
  lang: go
  source: |
    // add "the" 5x and "cherry" 1x, then read cherry's per-row counters:
    // row 0 col 0 = 1, row 1 col 5 = 1, row 2 col 2 = 1 + 5 = 6
    // Estimate = min(1, 1, 6) = 1
checkpoint: You have seen the minimum overrule a collision to recover the truth. Commit and stop here.
---

This is the payoff for paying for several rows. `"cherry"` appears once, but in row `2` it shares a column with `"the"`, which appeared five times, so that counter reads `6` - if you trusted any single row you might report `"cherry"`'s frequency as six. The other two rows, where `"cherry"` sits alone, still read `1`.

Taking the **minimum** is what makes this safe. A collision can only push a counter **up**, never down, so at least one of the clean rows survives untouched, and the min homes in on it. More rows means more independent chances that some row avoids every heavy hitter, which is why increasing the depth `d` drives the probability of a large over-estimate down. The next lesson turns that intuition into the exact sizing math.
