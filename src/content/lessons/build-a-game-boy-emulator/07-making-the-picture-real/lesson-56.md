---
project: build-a-game-boy-emulator
lesson: 56
title: Live palettes
overview: Lesson 43 built the BGP palette lookup, but your renderer doesn't yet read BGP live from its register, so the ROM's palette writes have no effect. Real ROMs route every background pixel through the BGP register and rewrite it constantly to flash, fade, and set the mood. Today you send the picture through BGP, read live from its register, so the palette the ROM programs is the one you see.
goal: Map each background pixel's color index to a shade through the BGP register (0xFF47) as the frame becomes displayable output, reusing lesson 43's lookup.
spec:
  scenario: The displayed shade comes from BGP
  status: failing
  lines:
    - kw: Given
      text: a background pixel with color index 1, and BGP (0xFF47) set to 0xE4 (the identity mapping, index i to shade i)
    - kw: When
      text: the frame is turned into display shades
    - kw: Then
      text: that pixel's shade is 1 (identity leaves indices unchanged, matching the earlier renderer)
    - kw: And
      text: after writing BGP = 0x1B (which maps index 0 to shade 3, 1 to 2, 2 to 1, 3 to 0), the same index-1 pixel becomes shade 2 and an index-0 pixel becomes shade 3
code:
  lang: go
  source: |
    // Reuse lesson 43's lookup: shade = (BGP >> (index*2)) & 0x03, with BGP = mem[0xFF47].
    // Read BGP LIVE from memory wherever your renderer turns a color index into the
    // pixel's shade — per-pixel in the scanline renderer or at the encode/display
    // step, whichever your earlier lessons chose; either is fine, just stop using a
    // fixed value. Identity BGP is 0xE4; with it the output is unchanged, so pin
    // BGP = 0xE4 in any earlier test that relied on an implicit identity palette.
reading: 'BGP (0xFF47) — four two-bit fields mapping each color index to a shade.'
checkpoint: The picture now honors the ROM's palette, read live from BGP; identity (0xE4) leaves it exactly as it was. Commit and stop here.
---

On lesson 43 you wrote the palette lookup, and on lesson 55 you made the background
register-driven. But the pixels you hand to the display are still raw color
indices `0`–`3`. Hardware never shows those directly: every background pixel
passes through **BGP** (`0xFF47`), four two-bit fields that map each index to one
of four shades. Games rewrite BGP mid-frame and between frames to fade to white,
flash on damage, or invert for an effect.

Wire lesson 43's lookup in wherever your renderer decides a pixel's final shade,
reading BGP straight from memory so the ROM's writes take effect. If an earlier lesson
already applied the palette while drawing (a perfectly fine choice), just switch
that spot to read BGP live from its register instead of a fixed value. The identity
value `0xE4` maps every index to itself, so with it the picture is exactly what you
drew before, and it only transforms once the ROM programs a different palette.
