---
project: build-a-bloom-filter
lesson: 17
title: Estimate is the minimum
overview: To read a frequency back, look at the item's counter in each row and take the smallest. Because collisions only ever add to a counter, the minimum is the tightest over-estimate available and never reads low. Today you implement Estimate.
goal: Estimate an item's frequency as the minimum of its mapped counters across all rows.
spec:
  scenario: The estimate is the minimum across rows
  status: failing
  lines:
    - kw: Given
      text: 'the sketch after adding "cat" three times, "dog" twice, and "the" five times'
    - kw: When
      text: 'each item is estimated'
    - kw: Then
      text: 'Estimate("cat") is 3, Estimate("dog") is 2, and Estimate("the") is 5'
    - kw: And
      text: 'Estimate("fox"), never added, is 0 - the estimate never reads below the true count'
code:
  lang: go
  source: |
    func (c *CountMin) Estimate(data []byte) uint64 {
      // take the minimum of the item's counter across all rows
    }
checkpoint: Your sketch estimates frequencies by taking the row minimum. Commit and stop here.
---

Reading a count back is where the name earns itself. Every one of an item's row counters holds *at least* its true frequency, because counters only ever get added to - the item's own additions are always in there, plus whatever collisions piled on. So each row gives an **over-estimate**, and the tightest one is the **minimum** across rows. That min is the Count-Min estimate.

The one-sided error is the guarantee to hold onto: the estimate can be too high when collisions inflate every row, but it can **never** be too low, because no row can hold less than the item's real count. Here each item happens to have a collision-free row, so the min lands exactly on the truth, and `"fox"` - never added - estimates `0`. When rows *do* collide, taking the minimum is what rescues the answer, as the next lesson shows.
