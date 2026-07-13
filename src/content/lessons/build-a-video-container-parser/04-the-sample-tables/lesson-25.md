---
project: build-a-video-container-parser
lesson: 25
title: The sync sample table
overview: The stss box lists which samples are keyframes - the ones you can seek to directly. Today you parse it and answer "is sample N a keyframe?", with the important default that no stss means every sample is a keyframe.
goal: Parse an stss box and decide whether a given sample number is a sync sample.
spec:
  scenario: stss identifies keyframes, defaulting to all when absent
  status: failing
  lines:
    - kw: Given
      text: 'an stss with entry_count 2 listing sync samples 1 and 31'
    - kw: When
      text: 'isKeyframe is asked for samples 1, 2, and 31'
    - kw: Then
      text: 'sample 1 is true, sample 2 is false, and sample 31 is true'
    - kw: And
      text: 'when a track has no stss at all, isKeyframe is true for every sample'
code:
  lang: go
  source: |
    // FullBox prefix(4) + entry_count(4) + entry_count * sample_number(4)
    // sample numbers are 1-based; absence of the table means all are sync
    func isKeyframe(syncSamples []uint32, sampleNum uint32) bool {
      if syncSamples == nil { return true } // no stss => every sample is a keyframe
      // otherwise true only if sampleNum is in the list
    }
checkpoint: You can identify keyframes. Commit and stop here.
---

`stss`, the sync-sample box, lists the sample numbers that are **keyframes**:
samples a decoder can jump straight to without needing earlier frames. Seeking uses
it to find the nearest keyframe before a target time. It is a plain FullBox with an
entry_count and that many 1-based sample numbers. Here samples `1` and `31` are
keyframes, so sample `2` is not.

The default is the subtle part: if a track has **no** `stss` box, it means **every**
sample is a sync sample - typical for audio, where every frame is independently
decodable. So "absent" is not "none," it is "all." Modelling that correctly (a nil
table answers true for everything) closes out the sample-table chapter, and the next
chapter turns all these tables into answers a user actually wants.
