---
project: build-a-bloom-filter
lesson: 15
title: The counter grid
overview: A Bloom filter answers "have I seen this?" A Count-Min sketch answers "how many times?" It is a two-dimensional grid of counters with one hash per row. Today you build the grid and its per-row indexing.
goal: Build a d-by-w counter grid and compute the column index each item maps to in every row.
spec:
  scenario: Each item maps to one column per row
  status: failing
  lines:
    - kw: Given
      text: 'a Count-Min sketch NewCountMin(3, 8) with 3 rows and 8 columns, where the column for an item in row r is (h1 + r times h2) mod 8'
    - kw: When
      text: 'the row columns for "cat" are computed'
    - kw: Then
      text: 'they are [7, 6, 5] for rows 0, 1, and 2'
    - kw: And
      text: 'the row columns for "the" are [4, 7, 2]'
code:
  lang: go
  source: |
    type CountMin struct {
      grid [][]uint64
      d, w int
    }
    func NewCountMin(d, w int) *CountMin { /* allocate d rows of w counters */ }
    // one column per row is exactly Indexes(data, d, w): (h1 + r*h2) mod w
    func (c *CountMin) columns(data []byte) []int { return Indexes(data, c.d, c.w) }
checkpoint: Your sketch maps every item to one column in each of its rows. Commit and stop here.
---

A **Count-Min sketch** estimates *frequencies* - how often each item appeared in a stream - in fixed space, the way a Bloom filter estimates membership. Its shape is a grid of counters, `d` rows deep and `w` columns wide, with an independent hash per row. Each item lands on exactly **one column in every row**, so a single item touches `d` counters, one per row.

Those per-row columns are nothing new: the `i`-th column is `(h1 + i * h2) mod w`, which is precisely the double-hashing `Indexes` function from the first chapter with `k = d` and `m = w`. Reusing it means each row's hash is independent of the others, which is what makes the estimate work. Today only builds the grid and the indexing; adding and estimating come next.
