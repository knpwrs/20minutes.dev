---
project: build-a-game-boy-emulator
lesson: 57
title: Sprite attributes
overview: Lesson 46 composited sprites but ignored each one's attribute byte, the fourth OAM byte that flips the sprite and chooses its palette. Games flip a sprite to make a character face the other way and swap its palette to recolor it, all without new tile data. Today you honor that byte, and draw the composited sprites into the finished frame.
goal: Honor the OAM attribute byte — X/Y flip and OBP0/OBP1 palette select — and composite the sprites into the full frame.
spec:
  scenario: The attribute byte flips a sprite and picks its palette
  status: failing
  lines:
    - kw: Given
      text: sprites are composited into the frame, OBP0 (0xFF48) is 0xE4 and OBP1 (0xFF49) is 0x1B, and a sprite at screen (0,0) whose top tile row is pixel 0 = index 3 and pixels 1–7 = index 0
    - kw: When
      text: the sprite's attribute byte is 0x20 (X-flip, bit 5)
    - kw: Then
      text: the sprite is mirrored — screen (7,0) is shade 3 and screen (0,0) shows the background (shade 0)
    - kw: And
      text: with attribute byte 0x10 instead (OBP1 select, bit 4, no flip), the index-3 pixel at (0,0) maps through OBP1 = 0x1B to shade 0
    - kw: And
      text: with no on-screen sprites the frame is byte-identical to the background-only frame
code:
  lang: go
  source: |
    // The attribute byte is OAM byte 3 of the entry. Bits that matter today:
    //   bit 4 = palette   (0 → OBP0 0xFF48, 1 → OBP1 0xFF49)
    //   bit 5 = X flip     (read tile column 7-px instead of px)
    //   bit 6 = Y flip     (read tile row 7-py instead of py)
    // When sampling the sprite's tile pixel, apply the flips to px/py; map a
    // non-zero index through the SELECTED palette, read LIVE from its register
    // (0xFF48/0xFF49) exactly as lesson 56 reads BGP. Also make the full-frame render
    // actually composite the sprites (draw background, then sprites on top), so all
    // of this shows up in the frame the emulator returns.
reading: 'The OAM attribute byte — the flip bits and the OBP0/OBP1 palette select.'
checkpoint: Sprites now flip and pick their palette from the attribute byte, and they land in the finished frame. Commit and stop here.
---

Lesson 46 drew sprites over the background but read only three of an OAM entry's four
bytes. The fourth, the **attribute byte**, is how one tile does many jobs. Bit 5
mirrors the sprite left-to-right and bit 6 top-to-bottom, so a character walking
left is the walking-right tile flipped, no extra art. Bit 4 picks between two
sprite palettes, **OBP0** (`0xFF48`) and **OBP1** (`0xFF49`), so the same tile can
be two colors.

Applying a flip is just sampling the tile at the mirrored coordinate: for X-flip
read column `7-px`, for Y-flip row `7-py`. Palette select is a choice of which
register to look up. While you are here, make the full-frame render actually put
the sprites on top of the background, so everything you have built for sprites
finally appears in the frame the emulator hands back, not just in a helper nobody
calls. (One more attribute bit, priority, decides when a sprite hides behind the
background; that one is left for the scope notes.)
