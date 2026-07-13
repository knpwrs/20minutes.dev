---
project: build-a-bloom-filter
lesson: 27
title: Frequency over a stream
overview: The same stream now flows through the Count-Min sketch, which answers how often each token appeared. Every estimate must be at least the true count and within the sketch's error bound. Today you pin those estimates.
goal: Feed the stream to a Count-Min sketch and confirm each estimate is at least the true frequency.
spec:
  scenario: Frequency estimates never read below the truth
  status: failing
  lines:
    - kw: Given
      text: 'the stream [cat, dog, the, cat, fox, the, cat, dog, the, the] added into a Count-Min sketch NewCountMin(3, 8), with true counts cat 3, dog 2, the 4, and fox 1'
    - kw: When
      text: 'each distinct token is estimated'
    - kw: Then
      text: 'Estimate returns cat 3, dog 2, the 4, and fox 1 - every estimate at least its true count'
    - kw: And
      text: 'row 0 of the grid reads [0, 2, 0, 0, 4, 0, 1, 3], and each estimate is within the error bound (here exact)'
code:
  lang: go
  source: |
    c := NewCountMin(3, 8)
    for _, tok := range stream { c.Add([]byte(tok)) }
    // Estimate(cat)=3, Estimate(dog)=2, Estimate(the)=4, Estimate(fox)=1
    // never below the true count; row 0 == [0,2,0,0,4,0,1,3]
checkpoint: The Count-Min sketch estimates frequencies over the stream with no under-counts. Commit and stop here.
---

Now the same ten tokens flow into a **Count-Min sketch** to answer **frequency**. Each token's `Add` bumps one counter per row, and `Estimate` reads the minimum across rows. Over this stream the sketch is roomy enough that every token has a collision-free row, so the estimates land exactly on the truth - `"the"` at `4`, `"cat"` at `3`, down to `"fox"` at `1`.

What the capstone really pins is the direction of the error. Every estimate is **greater than or equal to** the true count, never below it, because counters only accumulate - the one-sided guarantee that makes the sketch usable for finding heavy hitters. Even when a wider stream forces collisions, the minimum keeps the over-count bounded by `epsilon * N`, the width guarantee from the sizing lesson. Two of the three questions are answered; the last one - how many distinct - closes the project.
