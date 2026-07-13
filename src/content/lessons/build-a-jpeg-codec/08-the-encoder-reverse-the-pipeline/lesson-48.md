---
project: build-a-jpeg-codec
lesson: 48
title: Completing the bit writer
overview: The minimal bit writer from the DC-encode lesson packs bits but does not yet handle 0xFF or the final byte. Today you complete it with byte-stuffing and 1-bit padding, mirroring the decoder's bit reader.
goal: Extend the bit writer so it stuffs a 0x00 after every 0xFF byte and pads the final partial byte with 1-bits on flush.
spec:
  scenario: Packing bits with stuffing and padding
  status: failing
  lines:
    - kw: Given
      text: 'a bit writer'
    - kw: When
      text: 'the 8 bits 1,1,1,1,1,1,1,1 are written, then the writer is flushed'
    - kw: Then
      text: 'the output is the two bytes 0xFF, 0x00 - a full 0xFF byte followed by a stuffed 0x00'
    - kw: And
      text: 'writing only the 3 bits 0,1,0 then flushing pads the final byte with 1-bits to produce 0x5F'
code:
  lang: go
  source: |
    // WriteBits from the DC-encode lesson already packs MSB-first; extend its
    // byte-completion step so that whenever a full byte is 0xFF it also appends
    // 0x00 (stuffing). Add Flush to pad the partial byte with 1-bits.
    // type BitWriter struct{ out []byte; cur byte; nbits int }
    func (w *BitWriter) WriteBits(value, n int) { /* + stuff on 0xFF */ }
    func (w *BitWriter) Flush() { /* pad partial byte with 1-bits */ }
checkpoint: You can pack entropy bits into stuffed, padded bytes. Commit and stop here.
---

The bit writer already packs bits **most-significant first** from the DC-encode lesson; today it gains the two rules that make its output a legal scan, mirroring how the bit reader gained byte-stuffing a lesson after it was born. First: whenever a completed byte is `0xFF`, the writer immediately appends a **stuffed `0x00`** so the decoder does not mistake it for a marker - writing eight 1-bits therefore emits `FF 00`, not just `FF`.

At the end of the scan the last byte is usually partial, and JPEG pads it with **1-bits** - so writing just `010` and flushing yields `01011111 = 0x5F`. Padding with 1s (rather than 0s) is deliberate: it can never accidentally form the start of a valid short code that a decoder would misread, and it matches what the restart-marker alignment expects. With the bit writer done, every entropy symbol and magnitude value has a place to go, and the encoder can produce a real scan. The remaining lessons write the surrounding markers and assemble the file.
