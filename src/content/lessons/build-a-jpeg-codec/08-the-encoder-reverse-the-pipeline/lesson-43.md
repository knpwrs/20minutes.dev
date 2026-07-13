---
project: build-a-jpeg-codec
lesson: 43
title: Quantizing coefficients
overview: Quantization is where JPEG actually discards data - dividing each coefficient by a table value and rounding. Today you define the standard tables and quantize a block.
goal: Define the standard luminance and chrominance quantization tables and quantize a coefficient block by rounding each coefficient divided by its table value.
spec:
  scenario: Quantizing a coefficient block
  status: failing
  lines:
    - kw: Given
      text: 'the standard luminance quantization table (its first entry is 16, second 11) and a coefficient block whose DC is 512'
    - kw: When
      text: the block is quantized
    - kw: Then
      text: 'the quantized DC is 32, the rounded value of 512 divided by 16'
    - kw: And
      text: 'a coefficient of -35 divided by its table value 16 rounds to -2, and the chrominance table''s first entry is 17'
code:
  lang: go
  source: |
    // standard tables from the JPEG spec (Annex K); quantize is round(coef/q).
    // both the coefficient block and the table are in natural order here.
    var StdLumaQuant = [64]int{16,11,10,16,24,40,51,61, 12,12,14,19, /* ... */}
    func quantize(coef [64]float64, q [64]int) (out [64]int) { }
checkpoint: You can quantize a coefficient block with the standard tables. Commit and stop here.
---

**Quantization** is the lossy heart of JPEG. Each frequency coefficient is divided by a corresponding entry in a quantization table and rounded to the nearest integer, so `512/16 = 32` and `-35/16` rounds to `-2`. The table values grow toward the high frequencies - the standard luminance table starts at `16` for DC and climbs to `99` - so fine detail is quantized coarsely and often rounds to zero, which is exactly what produces the long zero runs the entropy coder exploits.

The spec's **Annex K** gives example tables for luminance and chrominance (chroma is quantized harder, its table starting at `17`), and using them at their standard values corresponds to roughly quality 50. A real encoder scales these tables up or down for a quality setting, but fixed standard tables are a perfectly valid baseline choice and keep this project focused. Rounding is where the original data is irretrievably lost; everything after this is exact again, just as everything before dequantize was exact on the decode side. Next you reorder the quantized block into zig-zag sequence for entropy coding.
