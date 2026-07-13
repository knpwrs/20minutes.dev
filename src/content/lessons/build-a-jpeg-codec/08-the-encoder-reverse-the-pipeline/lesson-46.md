---
project: build-a-jpeg-codec
lesson: 46
title: Encoding the DC coefficient
overview: The DC coefficient is coded as a difference from the previous block, a Huffman code for its category, then its magnitude bits. Today you emit that, mirroring the DC decode.
goal: Encode a block's DC as a difference from the predictor - a Huffman code for the category followed by the magnitude bits.
spec:
  scenario: Encoding a DC coefficient
  status: failing
  lines:
    - kw: Given
      text: 'a block with DC 3, a predictor of 0, and the standard luminance DC Huffman table'
    - kw: When
      text: the DC is encoded
    - kw: Then
      text: 'the difference is 3 (category 2), so the encoder emits the DC table''s code for category 2, which is 0b011, then the 2 magnitude bits 0b11'
    - kw: And
      text: 'the predictor is updated to 3 so the next block encodes its own difference'
code:
  lang: go
  source: |
    // introduce a minimal bit sink today: a BitWriter with WriteBits(value,n)
    // that packs bits MSB-first (byte-stuffing and final padding come in L48).
    // also add an encode-side code(symbol) -> (bits,length) lookup to the table
    // built in L14 (the decode side went code -> symbol).
    // diff := dc - pred; pred = dc
    // cat, bits := encodeMagnitude(diff)
    // emit dcTable.code(cat); if cat>0 { emit `cat` bits of `bits` }
    func encodeDC(w *BitWriter, dc int, pred *int, t *HuffTable) { }
checkpoint: You can encode a DC coefficient. Commit and stop here.
---

Encoding a DC is the exact reverse of decoding one. The encoder takes the difference between this block's DC and the running **predictor** (the previous block's DC in the same component), finds that difference's magnitude category, emits the **Huffman code** for the category from the DC table, and then emits the category's **magnitude bits**. For a difference of 3, the category is 2, whose standard luminance DC code is `011`, followed by the 2 bits `11`.

The predictor is updated to this block's DC and carried to the next block, precisely as on decode, so the two sides stay in lockstep. Using the same standard Huffman tables both encoder and decoder know means the emitted bits decode straight back to the difference. The DC is one symbol plus a few bits per block; the ACs are more involved because of runs, and they are the next lesson. To emit anything you need a **bit sink**, so today you also stand up a minimal bit writer with a `WriteBits` that packs bits most-significant first, mirroring the plain bit reader you built early in the scan chapter. It is deliberately incomplete - byte-stuffing and the padded final byte come in a later lesson, exactly as the reader gained byte-stuffing a lesson after it was born.
