---
project: build-a-bloom-filter
lesson: 5
title: k indices by double hashing
overview: A Bloom filter touches k positions per item, but computing k separate hashes is wasteful. Double hashing generates all k indices from just the two base hashes you already have.
goal: Produce k array indices for an item using the rule index_i = (h1 + i times h2) mod m.
spec:
  scenario: Double hashing yields k indices from two base hashes
  status: failing
  lines:
    - kw: Given
      text: 'Hash1 and Hash2 from the previous lessons, a table size m of 32, and k of 3'
    - kw: When
      text: 'the indices for "cat" are computed as (h1 + i times h2) mod 32 for i = 0, 1, 2'
    - kw: Then
      text: 'they are [7, 30, 21] in that order'
    - kw: And
      text: 'the indices for "dog" are [9, 10, 11]'
code:
  lang: go
  source: |
    func Indexes(data []byte, k, m int) []int {
      h1, h2 := Hash1(data), Hash2(data)
      out := make([]int, k)
      for i := 0; i < k; i++ {
        out[i] = int((h1 + uint64(i)*h2) % uint64(m)) // i=0 gives h1 mod m
      }
      return out
    }
checkpoint: You can turn any item into k reproducible array indices. Commit and stop here.
---

A Bloom filter with `k` hash functions would naively compute `k` full hashes per item. **Double hashing** avoids that: it builds the `i`-th index by stepping `h1` forward in strides of `h2`, so `index_i = (h1 + i * h2) mod m`. The first index (`i = 0`) is just `h1 mod m`; each later one adds another `h2`. This gives `k` positions that spread across the array as if they came from `k` independent hashes, at the cost of only two.

Because the arithmetic runs in unsigned 64-bit and only the final `mod m` brings it into range, the indices are fully determined by the two base hashes - the same input always yields the same list. Notice the indices are **not** sorted; they come out in `i` order, and duplicates are possible when the strides land on the same slot. Those `k` indices are the addresses every structure ahead will read and write.
