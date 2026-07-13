---
project: build-a-game-boy-emulator
lesson: 55
title: Scrolling the background
overview: Your PPU draws a fixed tile map at a fixed origin. Real ROMs pick which map to draw with the LCDC register and slide it around every frame with the scroll registers SCX and SCY, which is how a game world moves past the screen. Today you read those registers so the background the ROM set up is the one you draw.
goal: Make the background renderer read LCDC, SCX, and SCY from their registers so the ROM controls which map is drawn and where.
spec:
  scenario: The background follows the scroll registers
  status: failing
  lines:
    - kw: Given
      text: background tile column 0 is blank (pixel value 0) and column 1 is filled (pixel value 3) on the row covering LY = 0
    - kw: When
      text: SCX (0xFF43) is 0 and the LY = 0 background line is rendered
    - kw: Then
      text: screen pixel x = 0 has value 0 (it shows column 0)
    - kw: And
      text: after writing 8 to SCX and re-rendering LY = 0, screen pixel x = 0 has value 3 (the 8-pixel scroll pulls column 1 to the left edge)
    - kw: And
      text: the background tile-map base comes from LCDC bit 3 (0xFF40) — clear selects 0x9800, set selects 0x9C00
code:
  lang: go
  source: |
    // Read the three steering registers instead of hard-coding them:
    //   SCX = mem[0xFF43], SCY = mem[0xFF42]  (pixel scroll offsets)
    //   tile-map base = (mem[0xFF40] & 0x08) != 0 ? 0x9C00 : 0x9800  (LCDC bit 3)
    // For a screen pixel (x, ly), the BACKGROUND coordinate is
    //   bgX = (x + SCX) & 0xFF,  bgY = (ly + SCY) & 0xFF   (the 256x256 map wraps).
    // Index the map/tile with bgX,bgY. Defaults (all zero) reproduce lesson 44 exactly.
reading: 'LCDC, SCX, SCY — the registers that steer the background each frame.'
checkpoint: The background now follows the ROM's own scroll and map choice, not fixed defaults. A moving world finally moves. Commit and stop here.
---

Since lesson 44 your renderer has assumed one tile map at `0x9800` drawn with its top-left
corner pinned to the screen. Real games do neither: they choose a map with **LCDC**
(`0xFF40`), and every frame they write **SCX** (`0xFF43`) and **SCY** (`0xFF42`) to
scroll the 256×256 background under the 160×144 viewport. Sliding those two bytes is
how the ground scrolls in a platformer.

The change is to stop hard-coding and start reading. For each screen pixel, add the
scroll offset to get the background coordinate, wrapping in the 256-pixel map, and pick
the tile-map base from LCDC bit 3. Because a freshly reset machine has all three
registers at zero, this is fully backward-compatible: with no scroll and the default
map, you draw exactly what you drew on lesson 44. It only comes alive once the ROM starts
writing the registers, which is exactly what you want.
