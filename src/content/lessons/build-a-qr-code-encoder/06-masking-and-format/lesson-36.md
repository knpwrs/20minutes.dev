---
project: build-a-qr-code-encoder
lesson: 36
title: Format information
overview: 'The symbol must tell a scanner which error-correction level and mask it used, in a 15-bit field protected by its own error-correcting code. Today you build that format information and place it beside the finders.'
goal: 'Encode the 15-bit format information for an error-correction level and mask, and place it.'
spec:
  scenario: 'Format bits encode level and mask'
  status: failing
  lines:
    - kw: Given
      text: 'the 5-bit format data (2 bits for the level, 3 for the mask): level Q is 11 and mask 6 is 110, giving 11110'
    - kw: When
      text: 'the 10 BCH check bits (generator 0b10100110111) are appended and the whole 15-bit value is XORed with the fixed mask 0b101010000010010'
    - kw: Then
      text: 'the format information for level Q, mask 6 is 010111011011010'
    - kw: And
      text: 'those 15 bits are written twice - once wrapping the top-left finder (along row 8 and column 8), once split beside the top-right and bottom-left finders - so either copy alone can be read'
code:
  lang: go
  source: |
    // data = (levelBits<<3)|mask, 5 bits. Divide (data<<10) by the
    // BCH generator to get 10 check bits, then XOR the fixed mask.
    const bchGen = 0b10100110111       // degree-10 generator
    const fmtMask = 0b101010000010010  // applied so all-zero is invalid
    // fmt = ((data<<10) | remainder) XOR fmtMask   -> 15 bits
checkpoint: 'The format information is encoded and placed. Commit and stop here.'
---

The data codewords carry the message, but a scanner still needs two facts before it can read them: the **error-correction level** (to know the block structure) and the **mask** (to undo it). These live in the 15-bit **format information**. The first 5 bits are the payload - 2 bits of level (`L=01, M=00, Q=11, H=10`) and 3 bits of mask number - and the remaining 10 are **BCH check bits** so the format survives damage, computed by the same polynomial-remainder idea you used for Reed-Solomon, over a degree-10 binary generator. Finally the whole 15-bit value is XORed with a fixed mask pattern so that an all-light region cannot masquerade as valid format bits.

For level Q and mask 6 the payload is `11110`, and the finished format information is `010111011011010`. It is written **twice** for redundancy: one copy wraps the top-left finder along row 8 and column 8, and a second copy is split between the top-right and bottom-left finders - so a scanner can recover the format even if one copy is damaged. This is why lesson 27 reserved those exact modules. With format encoding in place, you can finally score all eight masks and choose.
