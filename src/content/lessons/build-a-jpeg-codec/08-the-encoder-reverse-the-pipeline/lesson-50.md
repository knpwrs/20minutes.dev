---
project: build-a-jpeg-codec
lesson: 50
title: Writing the frame and scan headers
overview: The file needs a SOF0 frame header and a SOS scan header describing the image and its table selectors. Today you serialize both, mirroring the parsers from the frame and scan chapters.
goal: Serialize a SOF0 frame header and a SOS scan header with correct markers, lengths, and per-component fields.
spec:
  scenario: Writing the frame and scan headers
  status: failing
  lines:
    - kw: Given
      text: 'a 16-by-16 single-component (grayscale) image with sampling 1x1, quant table 0, and DC and AC table 0'
    - kw: When
      text: the SOF0 and SOS headers are written
    - kw: Then
      text: 'the SOF0 is 0xFF,0xC0, length 0x00,0x0B, precision 0x08, height 0x00,0x10, width 0x00,0x10, then 0x01 component'
    - kw: And
      text: 'the SOS is 0xFF,0xDA, length 0x00,0x08, one component (id 0x01, then selector byte 0x00), then 0x00,0x3F,0x00 (Ss 0, Se 63, Ah/Al 0)'
code:
  lang: go
  source: |
    // SOF0: FF C0, len, precision(8), H(2), W(2), Nf, per comp: id,(H<<4|V),Tq
    //   len = 8 + 3*Nf
    // SOS:  FF DA, len, Ns, per comp: id,(Td<<4|Ta), then Ss(0),Se(63),00
    //   len = 6 + 2*Ns
    func writeFrameAndScan(f *Frame) []byte { }
checkpoint: You can write the SOF0 and SOS headers. Commit and stop here.
---

The **SOF0** header declares the image to the decoder: marker `FF C0`, a length, the precision byte (`8`), the height and width, the component count, and three bytes per component (id, packed sampling factors, quant selector). For a 16-by-16 grayscale image with one `1x1` component the length is `8 + 3 = 11` (`00 0B`). The **SOS** header names the scan's components and their Huffman selectors: marker `FF DA`, a length, the component count, a `(Td<<4)|Ta` selector byte per component, and the three baseline spectral bytes `00 3F 00`.

These are the exact structures the frame and scan chapters parsed, written in reverse, and their lengths follow the same self-counting rule as every other segment. Emitting them with the right selectors is what tells the decoder which of the tables you wrote earlier to apply to each component. Every segment the file needs can now be produced individually; the final lesson strings them together, wraps the entropy scan, and closes the file.
