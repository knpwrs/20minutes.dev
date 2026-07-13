---
project: build-a-video-container-parser
lesson: 22
title: The sample size table
overview: 'The stsz box gives each sample''s size in bytes, but with a twist: a single nonzero default means every sample shares that size, while a zero default means a per-sample table follows. Today you handle both forms.'
goal: Parse an stsz box that either uses one shared size or a per-sample size table.
spec:
  scenario: stsz handles a shared default and a per-sample table
  status: failing
  lines:
    - kw: Given
      text: 'an stsz with sample_size 0, sample_count 3, and a table of sizes 100, 200, 150'
    - kw: When
      text: 'the size of sample 1, 2, and 3 is asked for'
    - kw: Then
      text: 'they are 100, 200, and 150'
    - kw: And
      text: 'an stsz with sample_size 512 and sample_count 4 reports 512 for every sample, with no table read'
code:
  lang: go
  source: |
    // FullBox prefix(4) + sample_size(4) + sample_count(4) + [table]
    // if sample_size != 0, every sample is that size (no table)
    // if sample_size == 0, read sample_count sizes from the table
    func parseStsz(payload []byte) (defaultSize uint32, sizes []uint32) { /* fill in */ }
checkpoint: You can parse the sample size table. Commit and stop here.
---

`stsz`, the sample-size box, has two modes selected by its **sample_size** field. If
`sample_size` is **nonzero**, every sample in the track is exactly that many bytes
and no table follows - the common case for constant-size audio frames. If
`sample_size` is **zero**, it is followed by a **per-sample table** of
`sample_count` entries, one size each - the usual case for video, where every frame
differs.

This branch is the box's whole subtlety, and getting it backward is a classic bug:
a nonzero default with a table you should not read, versus a zero default that
demands one. Model it so a caller can ask "how big is sample N?" without caring
which mode was used - return the shared size when the default is nonzero, otherwise
index the table. That uniform question is exactly what the sample-location math will
ask.
