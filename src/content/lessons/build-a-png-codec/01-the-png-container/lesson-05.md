---
project: build-a-png-codec
lesson: 5
title: Critical versus ancillary chunks
overview: The case of the letters in a chunk type is not cosmetic - each letter's fifth bit encodes a property. Today you read the most important one, whether a chunk is critical or ancillary, straight from its type.
goal: Report whether a chunk type is critical or ancillary by inspecting the case of its first letter.
spec:
  scenario: Classifying a chunk by its type casing
  status: failing
  lines:
    - kw: Given
      text: 'the chunk types "IHDR", "PLTE", "gAMA", and "tEXt"'
    - kw: When
      text: each is classified
    - kw: Then
      text: '"IHDR" and "PLTE" are critical (uppercase first letter) and "gAMA" and "tEXt" are ancillary (lowercase first letter)'
    - kw: And
      text: 'a letter is uppercase exactly when bit 5 (value 32) of its ASCII byte is 0'
code:
  lang: go
  source: |
    // bit 5 (0x20) of a letter's ASCII byte is 0 for uppercase, 1 for lowercase.
    func isCritical(typ string) bool {
      return typ[0]&0x20 == 0 // first letter uppercase => critical
    }
checkpoint: You can tell a critical chunk from an ancillary one by its type alone. Commit and stop here.
---

PNG hides four flags in the **case** of the four type letters. The trick is that ASCII uppercase and lowercase differ only in **bit 5** (`0x20`): `I` is `0x49`, `i` is `0x69`. So the format reads that one bit of each letter as a property. The first letter's case is the **critical/ancillary** flag: uppercase means *critical* (a decoder must understand it to render the image, like `IHDR` and `PLTE`), lowercase means *ancillary* (safe to ignore if unknown, like `gAMA` or `tEXt`).

The other three letters carry the private/public bit, a reserved bit, and the safe-to-copy bit, all read the same way. You only need the critical flag to keep going - it is what lets a decoder skip a chunk it does not recognize while never silently dropping one it must honor. Today, pin just that first-letter test; the rest follow the identical pattern.
