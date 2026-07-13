---
project: build-a-video-container-parser
lesson: 19
title: The sample description and codec
overview: The stbl box holds the sample tables, and the first is stsd, which names the codec each track uses. Today you parse its entry count and the codec fourcc, telling you whether a track is avc1, mp4a, and so on.
goal: Parse an stsd box to its entry count and first sample entry's format fourcc.
spec:
  scenario: An stsd yields the codec fourcc
  status: failing
  lines:
    - kw: Given
      text: 'an stsd with entry_count 1, then a sample entry whose size is 16 and whose format at entry offset 4 is "avc1"'
    - kw: When
      text: 'the stsd is parsed'
    - kw: Then
      text: 'the entry count is 1 and the codec is "avc1"'
    - kw: And
      text: 'an stsd whose first entry format is "mp4a" reports codec "mp4a"'
code:
  lang: go
  source: |
    // FullBox prefix(4) + entry_count(4), then each sample entry is
    // size(4) + format(4 fourcc) + ...
    func parseStsd(payload []byte) (count uint32, codec string) {
      count = readU32(payload[4:8])       // after the FullBox prefix
      codec = readType(payload[12:16])    // first entry's format fourcc
    }
checkpoint: You can read a track's codec. Commit and stop here.
---

`stbl`, the sample table box, is where a track describes its actual media samples,
and `stsd` (sample description) comes first. It is a FullBox with an
**entry_count** followed by that many **sample entries**. Each entry begins with its
own size and a **format** fourcc naming the codec: `avc1` for H.264 video, `mp4a`
for AAC audio, and so on. The MP4 Registration Authority lists them all.

The layout is a FullBox prefix (4), then entry_count (4), then the first entry: its
size (4) at offset 8 and its format at offset 12. You only need the format fourcc
for a summary, so read it and stop - the rest of the entry describes codec-specific
configuration that decoding, not parsing, would use. This is the box that turns
"there is a video track" into "there is an H.264 video track."
