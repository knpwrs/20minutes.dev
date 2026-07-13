---
project: build-a-compression-tool
lesson: 9
title: Literal packets, so nothing explodes
overview: Pure run encoding is a disaster on data with no runs - it can nearly double the size. Today the encoder learns to pack non-repeating bytes into literal packets, so run-free input costs almost nothing extra.
goal: Have the encoder emit literal packets for stretches with no useful run, choosing runs only for length three or more.
spec:
  scenario: A mixed input packs as a literal then a run
  status: failing
  lines:
    - kw: Given
      text: 'the six-byte input ABAAAA (0x41 0x42 0x41 0x41 0x41 0x41)'
    - kw: When
      text: 'RLE Encode runs over it'
    - kw: Then
      text: 'the output is 0x01, 0x41, 0x42, 0x83, 0x41'
    - kw: And
      text: 'the leading 0x01 is a literal packet of two bytes A, B, and 0x83 is a run of four A'
code:
  lang: go
  source: |
    // buffer literals until a run of >=3 equal bytes starts, then flush both
    // literal packet: control = len-1 (high bit clear), then the bytes
    // run packet:     control = 0x80 | (len-1), then the value
    // only emit a run when it saves space: length >= 3
checkpoint: Non-repeating data packs into literal packets and never explodes. Commit and stop here.
---

A run packet costs two bytes to describe a run. If you naively made every single
byte a length-1 run, run-free data would nearly **double** - the classic
run-length trap. The fix is the **literal packet**: a control byte with the high
bit clear, holding `count - 1` in its low seven bits, followed by that many bytes
copied straight through. Now a stretch of unrepeating bytes costs just one control
byte for up to 128 of them.

The encoder's only new job is the choice. Walk the input; when the next three or
more bytes are equal, that is worth a run packet, so flush any pending literals and
emit the run. Otherwise add the byte to the current literal packet. Three is the
break-even point: a run packet is two bytes, so a run of one or two is no smaller
than just copying those bytes as literals. On `ABAAAA` the `A` and `B` are literals
(no run of three yet), then four `A` form a run, giving `0x01, 0x41, 0x42` then
`0x83, 0x41`. Worst case, output grows by only one control byte per 128 input
bytes - never a factor of two.
