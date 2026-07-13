---
project: build-a-video-container-parser
lesson: 21
title: The sample-to-chunk table
overview: Samples are grouped into chunks, and stsc records how many samples each chunk holds using a compact run list keyed by first-chunk. Today you parse those entries, which the sample-location math later depends on.
goal: Parse an stsc box into its (first_chunk, samples_per_chunk, sample_description_index) entries.
spec:
  scenario: An stsc decodes to its chunk-grouping runs
  status: failing
  lines:
    - kw: Given
      text: 'an stsc with entry_count 2 and entries (first_chunk 1, samples_per_chunk 2, desc 1) then (first_chunk 3, samples_per_chunk 1, desc 1)'
    - kw: When
      text: 'the stsc is parsed'
    - kw: Then
      text: 'the entries are [(1, 2, 1), (3, 1, 1)]'
    - kw: And
      text: 'the first entry reports samples_per_chunk 2'
code:
  lang: go
  source: |
    type SampleToChunk struct{ FirstChunk, SamplesPerChunk, DescIndex uint32 }
    // FullBox prefix(4) + entry_count(4) + entry_count * three uint32 fields
    func parseStsc(payload []byte) []SampleToChunk {
      n := readU32(payload[4:8])
      // read n triples of (first_chunk, samples_per_chunk, sample_description_index)
    }
checkpoint: You can parse the sample-to-chunk table. Commit and stop here.
---

Samples are stored in **chunks** - contiguous groups within the media data - and
`stsc`, the sample-to-chunk box, says how many samples each chunk holds. It uses a
run encoding keyed by **first_chunk**: an entry `(first_chunk, samples_per_chunk,
desc)` applies from that chunk until the next entry's `first_chunk`. So
`(1, 2, 1)` then `(3, 1, 1)` means chunks 1 and 2 hold 2 samples each, and chunks 3
onward hold 1 sample each.

This indirection is what keeps the table small for a file with thousands of chunks
that all hold the same number of samples: one entry covers them all. The
`sample_description_index` points back into `stsd` to say which codec entry a chunk
uses. You will combine this table with chunk offsets and sample sizes to locate any
sample in the file - the payoff at the end of this chapter.
