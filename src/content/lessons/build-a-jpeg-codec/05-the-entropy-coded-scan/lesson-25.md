---
project: build-a-jpeg-codec
lesson: 25
title: AC coefficients and run-length
overview: The 63 AC coefficients are coded as run-length pairs - a count of leading zeros and a magnitude category. Today you expand one AC symbol into a placed coefficient.
goal: Expand an AC Huffman symbol into a zero-run and a size, skip that many coefficients, then place the extended value.
spec:
  scenario: Placing an AC coefficient after a zero run
  status: failing
  lines:
    - kw: Given
      text: 'the current AC index is 1 and an AC symbol of 0x32 is decoded, with the next magnitude bits being 10'
    - kw: When
      text: the AC symbol is expanded
    - kw: Then
      text: 'the run is 3 (high nibble) and the size is 2 (low nibble), so 3 coefficients are skipped as zeros and the value is placed at index 4'
    - kw: And
      text: 'the size-2 magnitude bits 10 extend to the value +2 stored at index 4'
code:
  lang: go
  source: |
    // AC symbol byte: (run << 4) | size
    //   run  = high nibble = number of zero coefficients to skip
    //   size = low nibble  = magnitude category of the next value
    // advance index by run, then place receiveExtend(size) at that index.
    func placeAC(block *[64]int, index *int, sym byte, r *BitReader) { }
checkpoint: You can place a single AC coefficient from a run-length symbol. Commit and stop here.
---

The 63 AC coefficients of a block are mostly zero after the zig-zag reorder groups the high frequencies together, so JPEG codes them as **run-length pairs**. Each AC Huffman symbol is one byte splitting into two nibbles: the high nibble is a **run** of leading zero coefficients to skip, and the low nibble is the **size** (magnitude category) of the nonzero coefficient that follows. So `0x32` means "skip 3 zeros, then a size-2 value": starting from index 1 you advance past indices 1, 2, 3, and place the extended value at index 4.

The value itself comes from the same receive-and-extend you built for DC - here `10` with size 2 extends to `+2`. This is the loop that fills a block: decode an AC symbol, jump the index forward by the run, place a coefficient, and repeat, walking from index 1 toward index 63. Two symbols get special treatment - the end-of-block and the full zero-run - and those are the next lesson; today you handle the ordinary run-then-value case that does the bulk of the work.
