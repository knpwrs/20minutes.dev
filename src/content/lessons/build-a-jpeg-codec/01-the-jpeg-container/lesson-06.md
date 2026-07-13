---
project: build-a-jpeg-codec
lesson: 6
title: Walking the segments
overview: With markers, lengths, and the standalone rule in hand, you can walk a whole file and list its segments. Today you build the loop that steps marker to marker, skipping anything it does not recognize, all the way to the scan.
goal: Walk a JPEG from SOI, collecting the marker code of every segment, stopping when the scan marker SOS is reached.
spec:
  scenario: Walking the marker sequence
  status: failing
  lines:
    - kw: Given
      text: 'a stream SOI, APP0 (length 16, 14 payload bytes), DQT (length 4, 2 payload bytes), then SOS (0xDA)'
    - kw: When
      text: the segments are walked
    - kw: Then
      text: 'the collected marker codes in order are 0xD8, 0xE0, 0xDB, and the walk stops at 0xDA (SOS)'
    - kw: And
      text: 'an unknown APPn segment in the middle is skipped by its length, not parsed'
code:
  lang: go
  source: |
    // loop: read marker; if standalone advance 2 (SOI) ; else read length
    // and skip the payload. Stop when the marker is SOS (0xDA): the entropy
    // scan begins right after its header and is not marker-framed.
    // sosAt = the offset of SOS's leading 0xFF byte.
    func walk(b []byte) (markers []byte, sosAt int) { }
checkpoint: Your decoder can walk a real JPEG's segment list and find the scan. Commit and stop here.
---

Now the pieces of this chapter connect into a **segment walk**. Start just past SOI, and repeat: read a marker code, decide whether it is standalone or length-prefixed, and either step over it or read its length and skip its payload to land on the next marker. You do not need to understand a segment to skip it - that is the whole point of the length field - so an unfamiliar `APPn` or comment segment is jumped cleanly rather than misread.

The walk stops at **SOS** (`0xDA`), Start Of Scan. That marker has a short header of its own, but immediately after it comes the entropy-coded image data, which is a raw bitstream and is **not** marker-framed the way the segments before it are. So the header walk ends at SOS; everything up to it - the quantization tables, Huffman tables, and frame header you parse in the coming chapters - is reachable by exactly this loop. This is the demoable milestone: hand it a real JPEG and it prints the segment sequence.
