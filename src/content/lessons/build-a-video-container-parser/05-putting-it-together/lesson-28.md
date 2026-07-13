---
project: build-a-video-container-parser
lesson: 28
title: Locating a sample
overview: The deepest question a container parser answers is "where in the file is sample N, and how big is it?" Today you combine the sample-to-chunk, chunk-offset, and sample-size tables to compute an exact byte offset and length.
goal: Compute a sample's absolute byte offset and size from stsc, stco, and stsz.
spec:
  scenario: A sample's file position is computed from the three tables
  status: failing
  lines:
    - kw: Given
      text: 'stsc [(first_chunk 1, samples_per_chunk 2, desc 1)], stco offsets [40, 2048], and per-sample sizes [100, 200, 150, 250]'
    - kw: When
      text: 'the location of sample 3 is computed (1-based sample numbering)'
    - kw: Then
      text: 'sample 3 is in chunk 2 at absolute offset 2048 with size 150'
    - kw: And
      text: 'sample 2 is in chunk 1 at offset 140 (40 + the 100-byte sample 1) with size 200'
code:
  lang: go
  source: |
    // 1. use stsc to find which chunk sample N is in and its index within it
    // 2. the chunk's base offset comes from stco[chunkIndex]
    // 3. add the sizes (from stsz) of the earlier samples in that same chunk
    func sampleLocation(n uint32) (offset uint64, size uint32) { /* fill in */ }
checkpoint: You can locate any sample in the file. Commit and stop here.
---

This is the calculation the whole sample-table chapter was building toward. To find
**sample N**: walk the `stsc` runs to learn how many samples each chunk holds, which
tells you the **chunk** the sample falls in and its **index within** that chunk. The
chunk's starting byte comes from `stco` (or `co64`). Then add up the `stsz` sizes of
the samples that come **before** N in the same chunk, and that sum plus the chunk
offset is the sample's absolute position; its own `stsz` size is its length.

With `(1, 2, 1)` every chunk holds 2 samples, so sample 3 is the first sample of
chunk 2 - offset `2048`, size `150`, nothing to add before it. Sample 2 is the
second sample of chunk 1, so its offset is `40 + 100` = `140` (past sample 1's 100
bytes), size `200`. This is how a player extracts a frame without decoding anything
around it, and it is the last piece before the capstone.
