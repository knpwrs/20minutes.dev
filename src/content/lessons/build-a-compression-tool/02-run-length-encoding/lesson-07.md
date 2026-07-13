---
project: build-a-compression-tool
lesson: 7
title: Encoding a run
overview: 'The simplest win in compression is a run - the same byte many times over. Today you build the first real codec: turn a repeated byte into a two-byte packet that records the count and the value.'
goal: Encode a byte repeated N times as a run packet, a control byte then the value.
spec:
  scenario: A run of six becomes two bytes
  status: failing
  lines:
    - kw: Given
      text: 'the six-byte input AAAAAA (six copies of 0x41)'
    - kw: When
      text: 'RLE Encode runs over it'
    - kw: Then
      text: 'the output is two bytes 0x85, 0x41'
    - kw: And
      text: 'the control byte 0x85 means a run whose length is (0x85 and 0x7F) + 1 = 6, and 0x41 is the repeated value'
code:
  lang: go
  source: |
    // a run packet: high bit set marks a run; low 7 bits hold count-1
    func encodeRun(b byte, count int) []byte {
      ctrl := byte(0x80 | (count - 1)) // count 1..128 -> 0x80..0xFF
      return []byte{ctrl, b}
    }
    // scan consecutive equal bytes and emit one run packet per group
checkpoint: A repeated byte compresses to a two-byte run packet. Commit and stop here.
---

**Run-length encoding** is the first codec worth writing because runs are
everywhere - whitespace, silence, background pixels - and each is almost free to
compress. The idea is to replace `count` copies of a byte with a small **packet**
that names the count and the value. Six copies of `0x41` collapse to two bytes.

The packet is a **control byte** followed by the value. We reserve the high bit of
the control byte to mean "this is a run," and store `count - 1` in the low seven
bits, so a single packet covers runs of length 1 through 128. Length 6 gives
control `0x80 | 5 = 0x85`, and the value byte is `0x41`. Storing `count - 1`
rather than `count` is deliberate: a run always has at least one byte, so it lets
one packet reach 128 instead of 127. The high bit staying clear is what will later
mark the other kind of packet - literals - so runs and literals can share one
stream.
