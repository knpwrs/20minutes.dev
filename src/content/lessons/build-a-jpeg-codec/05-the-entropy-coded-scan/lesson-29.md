---
project: build-a-jpeg-codec
lesson: 29
title: Restart markers
overview: Restart markers punctuate the scan so a decoder can resync after damage, and they reset the DC predictors. Today you handle DRI and the RSTn markers, completing the entropy decoder.
goal: Honor the restart interval - at each RSTn marker, byte-align the reader and reset every DC predictor to zero.
spec:
  scenario: Resetting at a restart marker
  status: failing
  lines:
    - kw: Given
      text: 'a DRI segment sets the restart interval to 1 MCU, and after the first MCU an RST0 marker (0xFF, 0xD0) appears in the stream'
    - kw: When
      text: the decoder reaches the restart between MCUs
    - kw: Then
      text: 'every component''s DC predictor is reset to 0, so the next MCU''s first block DC equals its own difference alone'
    - kw: And
      text: 'the bit reader discards any remaining bits of the current byte and consumes the two-byte RSTn marker before decoding continues'
code:
  lang: go
  source: |
    // DRI (0xDD) payload: 2-byte restart interval (MCUs between restarts).
    // after `interval` MCUs: expect FF Dn (n=0..7). Then:
    //   r.alignToByte()       // drop the rest of the current byte
    //   consume the 2 marker bytes
    //   reset every component's DC predictor to 0
    // (comps here is the predictor-carrying decode view from lesson 28,
    //  not the scan header's ScanComp)
    func restart(r *BitReader, comps []mcuComp) { }
checkpoint: Your entropy decoder honors restart markers. The full scan decodes - commit and stop here.
---

**Restart markers** make the scan resynchronizable: every so often the encoder emits one, and if a decoder gets lost in corrupted data it can scan forward to the next restart and pick up cleanly. The **DRI** segment (Define Restart Interval, marker `0xDD`) sets how many MCUs go between restarts. After that many MCUs, the stream contains an **RSTn** marker - `0xFF` followed by `0xD0` through `0xD7`, cycling `0..7` so a decoder can tell if one was skipped.

Two things happen at a restart. First, the bit reader **byte-aligns**: the encoder pads the last entropy byte before the marker with 1-bits, so the decoder throws away whatever bits remain in the current byte and steps to the marker, then past its two bytes. Second, every component's **DC predictor resets to 0**, exactly as if the scan were starting fresh - which is why restarts also bound how far a single corrupted DC can propagate. With restarts handled, the entropy decoder is complete: it turns the whole scan into blocks of coefficients, and the rest of the decoder turns those into pixels.
