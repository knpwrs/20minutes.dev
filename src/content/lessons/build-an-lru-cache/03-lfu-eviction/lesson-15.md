---
project: build-an-lru-cache
lesson: 15
title: Advancing minFreq in O(1)
overview: The last piece of the O(1) puzzle is keeping minFreq current without ever scanning. The insight is that minFreq barely moves - it climbs by one only when the smallest bucket empties, and it snaps back to 1 whenever a new key arrives.
goal: Maintain minFreq incrementally - up by one when the min bucket empties, back to 1 on any insert.
spec:
  scenario: minFreq climbs by one and resets on insert
  status: failing
  lines:
    - kw: Given
      text: 'a cache NewLFU(3) with Put(1, 10) and Put(2, 20), so MinFreq() = 1 (capacity 3 leaves room, so no eviction fires and only the minFreq machinery is in play)'
    - kw: When
      text: 'Get(1) and then Get(2) are called, emptying the frequency-1 bucket'
    - kw: Then
      text: 'MinFreq() = 2 - both keys are now at frequency 2 and nothing remains at 1'
    - kw: And
      text: 'a following Put(3, 30) inserts a fresh frequency-1 key and resets MinFreq() to 1, with Freq(3) = 1'
code:
  lang: go
  source: |
    // in touch, after moving the key up one bucket:
    if c.buckets[e.freq-1].Len() == 0 && c.minFreq == e.freq-1 {
      c.minFreq++ // the old min bucket just emptied; the next stop is exactly +1
    }
    // on inserting a brand-new key: c.minFreq = 1
checkpoint: minFreq is maintained in O(1), climbing on an empty min bucket and resetting on insert. Commit and stop here.
---

Here is the observation that makes LFU O(1): when you use the key that was sitting
alone in the smallest bucket, that bucket empties and the new smallest frequency is
**exactly one more** than it was. A use lifts a key from frequency `f` to `f+1`, so
if `f` was the minimum and its bucket is now empty, the minimum becomes `f+1` - never
a jump you would have to search for. So instead of recomputing `minFreq`, you nudge
it up by one at precisely the moment its bucket drains.

The other half is the **reset**: any brand-new key enters at frequency 1, which is
the smallest frequency possible, so an insert always sets `minFreq` back to 1 - even
if the cache had climbed to a minimum of 5. That "cold reset" is what keeps a new
key evictable and is the twin of LFU's cold-start weakness. With these two rules -
advance by one when the min bucket empties, snap to 1 on insert - `minFreq` is
always correct and never scans, so the eviction in the next lesson is a single
constant-time lookup.
