---
title: 'Build a JPEG Encoder and Decoder'
order: 21
lessons: 53
size: 'Large'
tech: ['DCT', 'Entropy coding', 'Chroma subsampling']
estMin: 20
desc: 'Decode and encode baseline JPEG: entropy coding, dequantization, the IDCT, and color transforms.'
blurb: 'Start by recognizing two marker bytes and end with a codec that decodes a real baseline JPEG to pixels and encodes pixels back into a valid JPEG. Along the way you build the hard middle from scratch - a bit reader that understands byte-stuffing, canonical Huffman decode tables, the receive-and-extend signed-magnitude decode, run-length AC coefficients, and a separable inverse DCT - then reverse every stage into a forward DCT, quantizer, and entropy encoder that produces files any JPEG viewer will open.'
overview: |
  Over 53 lessons you build a working baseline JPEG codec from first principles, decoder first and then encoder. You begin with the container: the 0xFF-prefixed marker structure, SOI and EOI, the two-byte segment length framing, the APP0/JFIF header, and how to skip segments you do not recognize. Then you parse the tables and the frame: quantization tables in both 8-bit and 16-bit precision with the zig-zag storage order, DC and AC Huffman tables built from their 16 code-length counts into canonical decode tables, and the SOF0 frame with per-component sampling factors and MCU geometry. The centerpiece is the entropy-coded scan: an MSB-first bit reader that handles byte-stuffing, the receive-and-extend decode that turns a magnitude category into a signed coefficient, DC coefficients as differentials against a per-component predictor, AC coefficients as run-length pairs with the EOB and ZRL special symbols, and restart markers that realign the stream and reset the predictors. You dequantize, inverse-zig-zag, run a separable inverse DCT, level-shift and clamp, upsample chroma, and convert YCbCr to RGB to finish a decoder that turns a real baseline JPEG into pixels.

  With a complete decoder in hand you reverse the whole pipeline: convert RGB to YCbCr, downsample chroma, level-shift, run a forward DCT, quantize with the standard example tables, zig-zag, and entropy-encode with run-length and the standard Huffman tables, then write every marker - SOI, APP0, DQT, SOF0, DHT, SOS, the byte-stuffed entropy scan, and EOI - into a valid baseline JPEG. The reference encoder you assemble writes a single-component (grayscale) baseline file, which exercises the whole DCT, quantize, and entropy path; wiring the color-conversion and downsampling stages you also build into a full 4:2:0 encoder is a natural extension. The capstone decodes an embedded baseline JPEG to pixels and proves your encoder writes a structurally valid file that round-trips back within a small tolerance.

  This is a teaching-grade codec built around the real JPEG (ITU-T T.81) and JFIF specifications, and it is deliberately scoped to baseline sequential DCT only. It does not implement progressive JPEG, arithmetic coding, or 12-bit precision, and the encoder writes grayscale rather than color. Because JPEG is lossy, the codec is exact where a stage is lossless - Huffman decode, dequantization, a known coefficient block through the inverse DCT, and color conversion of exact inputs all produce exact values - while a full decode, encode, and decode round-trip is proven correct within a stated per-channel tolerance rather than byte for byte. What you finish with is the honest core that libraries like libjpeg extend with progressive scans, color encoding, optimized Huffman tables, and higher precision.
parts:
  - name: 'The JPEG container'
    count: 6
  - name: 'Quantization tables'
    count: 4
  - name: 'Huffman tables'
    count: 4
  - name: 'The baseline frame'
    count: 4
  - name: 'The entropy-coded scan'
    count: 11
  - name: 'Dequantize and inverse DCT'
    count: 4
  - name: 'Color and upsampling'
    count: 4
  - name: 'The encoder: reverse the pipeline'
    count: 14
  - name: 'Capstone'
    count: 2
caveats:
  note: 'The codec fully and correctly implements baseline sequential JPEG (grayscale and 4:2:0/4:4:4 decode, grayscale encode) with graceful handling of unsupported and corrupt input, but deliberately stops short of color encoding, progressive and arithmetic decoding, and optimized Huffman tables.'
  future:
    - 'Extend the encoder to write 3-component 4:2:0/4:4:4 color output instead of grayscale-only'
    - 'Generate custom per-image Huffman tables on encode instead of always using the fixed standard tables'
    - 'Replace nearest-neighbor chroma upsampling with bilinear filtering for smoother decoded images'
    - 'Add progressive JPEG decoding (multiple scans, spectral selection, successive approximation)'
    - 'Add finer-grained corruption diagnostics for malformed inputs that currently fall through to a generic error'
    - 'Offer a streaming reader/writer API instead of requiring whole-file byte slices'
resources:
  - title: 'ITU-T T.81 - Digital Compression and Coding of Continuous-Tone Still Images (the JPEG specification)'
    author: 'ITU-T / ISO-IEC 10918-1'
    url: 'https://www.w3.org/Graphics/JPEG/itu-t81.pdf'
    note: 'The authoritative JPEG standard: marker codes, the DQT/DHT/SOF0/SOS segment layouts, the canonical Huffman construction (Annex C), the receive/extend and run-length entropy decode (Annex F), and the standard example tables (Annex K). The primary reference for the whole project.'
  - title: 'JPEG File Interchange Format (JFIF), Version 1.02'
    author: 'Eric Hamilton / C-Cube Microsystems'
    url: 'https://www.w3.org/Graphics/JPEG/jfif3.pdf'
    note: 'The JFIF container conventions layered on top of T.81: the APP0 segment identifier and version, the density units, and the YCbCr color model and full-range level conventions the codec assumes.'
  - title: 'A note about the JPEG decoding algorithm (the Independent JPEG notes)'
    author: 'Cristi Cuturicu'
    url: 'https://www.opennet.ru/docs/formats/jpeg.txt'
    note: 'A famous plain-text walkthrough that decodes a baseline JPEG by hand: the marker walk, the Huffman tables, the DC/AC entropy decode with byte-stuffing, and the MCU assembly. The clearest single companion when your entropy decoder misbehaves.'
  - title: 'Understanding and Decoding a JPEG Image'
    author: 'ImpulseAdventure (Calvin Hass)'
    url: 'https://www.impulseadventure.com/photo/jpeg-decoder.html'
    note: 'A readable, worked baseline-JPEG walkthrough with annotated hex - a gentle orientation to the segment stream, quantization, and the entropy scan before diving into the formal spec.'
  - title: 'JPEG (overview article)'
    author: 'Wikipedia'
    url: 'https://en.wikipedia.org/wiki/JPEG'
    note: 'A broad overview of the JPEG pipeline - the DCT, quantization, chroma subsampling, and entropy coding - useful for the intuition behind why each stage looks the way it does.'
---
