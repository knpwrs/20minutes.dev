---
project: build-a-jpeg-codec
lesson: 19
title: The SOS scan header
overview: The Start Of Scan segment names which components are in this scan and which Huffman tables decode each. Today you read it, the last header before the raw entropy stream.
goal: Read a baseline SOS header - the component count, each component's DC and AC table selectors, and the spectral parameters.
spec:
  scenario: Reading the scan header
  status: failing
  lines:
    - kw: Given
      text: 'a SOS payload of bytes 0x03, 0x01,0x00, 0x02,0x11, 0x03,0x11, 0x00, 0x3F, 0x00'
    - kw: When
      text: the scan header is read
    - kw: Then
      text: 'there are 3 scan components; component 1 uses DC table 0 and AC table 0, and component 2 uses DC table 1 and AC table 1'
    - kw: And
      text: 'the spectral selection is Ss 0, Se 63, and the successive-approximation byte is 0x00 (Ah 0, Al 0), as baseline requires'
code:
  lang: go
  source: |
    // SOS (0xDA) payload:
    //   1 byte  number of scan components Ns
    //   per component: id byte, then (Td<<4 | Ta) selector byte
    //   1 byte  Ss (0)   1 byte Se (63)   1 byte (Ah<<4 | Al) (0x00)
    // entropy-coded data begins immediately after this header.
    type ScanComp struct{ ID, Td, Ta byte }
checkpoint: You can read the scan header and its table selectors. Commit and stop here.
---

**SOS** (Start Of Scan, marker `0xDA`) is the final header. It lists the components in this scan and, for each, a byte packing the **DC table selector** (`Td`, high nibble) and **AC table selector** (`Ta`, low nibble) - so the decoder knows which of the Huffman tables from the DHT segments to use for each component's DC and AC coefficients. After the per-component selectors come three bytes: **Ss** and **Se**, the first and last spectral coefficient in this scan, and a byte holding the successive-approximation bits **Ah** and **Al**.

For **baseline** JPEG these three are fixed: `Ss = 0`, `Se = 63` (every coefficient, DC through the last AC), and `Ah = Al = 0` (no successive approximation). Progressive JPEG varies them to send coefficients in multiple passes, but that mode is out of scope here, and seeing anything but `0, 63, 0` is a sign of an image this codec does not handle. The moment this header ends, the raw entropy-coded bitstream begins - and that stream is what the rest of this chapter decodes.
