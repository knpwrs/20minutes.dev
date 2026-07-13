---
project: build-a-bloom-filter
lesson: 16
title: Add increments one per row
overview: Recording an occurrence in a Count-Min sketch means bumping one counter in every row - the column that item hashes to. Today you implement Add and watch the grid fill from a small stream.
goal: Increment each row's mapped counter on Add so the grid accumulates per-item counts.
spec:
  scenario: Adding an item raises one counter per row
  status: failing
  lines:
    - kw: Given
      text: 'a fresh Count-Min sketch NewCountMin(3, 8)'
    - kw: When
      text: '"cat" is added 3 times'
    - kw: Then
      text: 'the counters at row 0 column 7, row 1 column 6, and row 2 column 5 each read 3, and every other counter is 0'
    - kw: And
      text: 'after also adding "dog" twice and "the" five times, row 0 reads [0, 2, 0, 0, 5, 0, 0, 3]'
code:
  lang: go
  source: |
    func (c *CountMin) Add(data []byte) {
      for r, col := range c.columns(data) {
        c.grid[r][col]++
      }
    }
checkpoint: Your sketch accumulates counts across its rows. Commit and stop here.
---

`Add` is the write path, and it is almost the same move as a counting Bloom filter's `Add` - increment the item's mapped counters - except a Count-Min sketch bumps exactly one counter **per row** rather than `k` counters in a single array. Adding `"cat"` three times raises its three mapped counters to `3`; adding a different item raises a different (mostly non-overlapping) set of counters.

Watch what row `0` holds after the whole little stream: `"the"`'s five land in column `4`, `"dog"`'s two in column `1`, and `"cat"`'s three in column `7`, giving `[0, 2, 0, 0, 5, 0, 0, 3]`. Each row is an independent, lossy tally of the same stream. Where two items share a column in some row, that counter holds the **sum** of both - the source of over-counting that the next lesson turns to the sketch's advantage.
