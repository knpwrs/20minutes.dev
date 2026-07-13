---
project: build-a-video-container-parser
lesson: 20
title: The time-to-sample table
overview: The stts box says how long each sample lasts, stored as a run-length list of (count, delta) pairs. Today you parse those runs and total up how many samples the track has.
goal: Parse an stts box into its (count, delta) runs and the total sample count.
spec:
  scenario: An stts decodes to runs and a sample total
  status: failing
  lines:
    - kw: Given
      text: 'an stts with entry_count 2 and entries (count 3, delta 1000) then (count 2, delta 512)'
    - kw: When
      text: 'the stts is parsed'
    - kw: Then
      text: 'the runs are [(3, 1000), (2, 512)]'
    - kw: And
      text: 'the total sample count is 5'
code:
  lang: go
  source: |
    type TimeToSample struct{ Count, Delta uint32 }
    // FullBox prefix(4) + entry_count(4) + entry_count * (count(4), delta(4))
    func parseStts(payload []byte) (runs []TimeToSample, total uint32) {
      n := readU32(payload[4:8])
      // read n pairs starting at offset 8; total is the sum of the counts
    }
checkpoint: You can parse the time-to-sample table. Commit and stop here.
---

`stts`, the time-to-sample box, encodes each sample's **duration** compactly. Rather
than storing a delta per sample, it stores **runs**: a `(count, delta)` pair means
"the next `count` samples each last `delta` time units." A track whose samples are
evenly spaced needs just one run for the whole track. Multiply and sum to get the
total media duration; add up the counts to get the number of samples.

Here `(3, 1000)` and `(2, 512)` describe 5 samples in total - the sum of the counts.
That sample total is a number several later boxes cross-check against: `stsz` should
list exactly that many sizes, and the sample-location math walks that many samples.
The run-length shape - an entry_count then that many fixed-size records - is the
template for every table in this chapter.
