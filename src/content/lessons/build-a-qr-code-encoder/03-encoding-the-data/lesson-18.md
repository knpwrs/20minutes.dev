---
project: build-a-qr-code-encoder
lesson: 18
title: Byte mode
overview: 'Alphanumeric mode cannot encode lowercase or arbitrary bytes, so QR also has a byte mode that stores one 8-bit value per character. Today you add it, reusing the same header, terminator, and padding pipeline you just built.'
goal: 'Encode text in byte mode with its own mode indicator and 8-bit character count.'
spec:
  scenario: 'Byte mode encodes one octet per character'
  status: failing
  lines:
    - kw: Given
      text: 'the string "Hi" in byte mode, with mode indicator 0100 and a Version 1 byte-mode count of 8 bits'
    - kw: When
      text: 'the header and the two character bytes are written (H=0x48, i=0x69)'
    - kw: Then
      text: 'the payload before padding is 28 bits: 0100 00000010 01001000 01101001'
    - kw: And
      text: 'the same terminator and pad-byte steps then fill it to capacity, so only the mode indicator, count width, and per-character encoding differ from alphanumeric'
code:
  lang: go
  source: |
    // Byte mode = 0100, 8-bit count in Version 1, one octet each.
    w.writeBits(0b0100, 4)
    w.writeBits(len(bytes), 8)
    for _, c := range bytes {
      w.writeBits(int(c), 8)
    }
checkpoint: 'Your encoder supports both alphanumeric and byte modes. Commit and stop here.'
---

Alphanumeric mode is compact but limited: no lowercase, no arbitrary symbols. **Byte mode** removes the limit by storing each character as a full 8-bit value (interpreted as Latin-1 / ISO-8859-1), so it can encode any byte at the cost of density. Its mode indicator is `0100`, and in Version 1 its character count is 8 bits wide - different widths, same idea as the alphanumeric header.

Everything downstream is shared. Encoding `"Hi"` writes `0100`, the count `00000010`, then `01001000` (`H`, `0x48`) and `01101001` (`i`, `0x69`) - a 28-bit payload before padding. From there the **terminator, byte padding, and pad bytes** are identical to the alphanumeric path, and so is the Reed-Solomon and layout work still ahead. That is the point of building the pipeline in stages: a new mode only touches the header and per-character step. With data encoding complete for two modes, the next chapter assembles data and error-correction codewords into the final sequence the symbol will carry.
