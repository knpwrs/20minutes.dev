---
project: build-a-compression-tool
lesson: 10
title: Splitting oversized packets
overview: A packet can only count to 128, so a longer run must split. Today you pin that boundary - a 200-byte run becomes two run packets - completing a run-length codec that handles any input.
goal: Split runs (and literals) longer than 128 into successive packets, and round-trip a long run.
spec:
  scenario: A run of 200 splits into two packets
  status: failing
  lines:
    - kw: Given
      text: 'an input of 200 copies of 0x41'
    - kw: When
      text: 'RLE Encode runs over it'
    - kw: Then
      text: 'the output is 0xFF, 0x41, 0xC7, 0x41 - a run of 128 then a run of 72'
    - kw: And
      text: 'Decode of that output returns all 200 bytes, and Decode(Encode(x)) holds for any long run or literal stretch'
code:
  lang: go
  source: |
    // a single packet counts at most 128; emit full packets, then the remainder
    for count > 0 {
      n := count
      if n > 128 { n = 128 }
      out = append(out, byte(0x80|(n-1)), value) // run packet of n
      count -= n
    }
    // 200 -> 128 (ctrl 0xFF) + 72 (ctrl 0x80|71 = 0xC7)
checkpoint: The run-length codec handles runs and literals of any length. Commit and stop here.
---

The control byte stores `count - 1` in seven bits, so one packet tops out at 128.
Anything longer must **split** into several packets. A run of 200 becomes a
128-run followed by a 72-run: control `0x80 | 127 = 0xFF` then the value, then
control `0x80 | 71 = 0xC7` then the value again. The decoder needs no change - it
already reads packets until the stream ends, so two packets simply expand to 200
bytes.

Literal packets split the same way: buffer at most 128 literals before emitting a
packet and starting a fresh one. With splitting in place the run-length codec is
complete and total - it accepts any input, never expands run-free data by more than
a control byte per 128, and always round-trips. That is a real, if modest,
compressor, and a good template for the pattern the rest of the project follows:
define a format, pin its exact bytes, and prove the round trip. Next you reach for
a much stronger idea - coding symbols by how often they appear.
