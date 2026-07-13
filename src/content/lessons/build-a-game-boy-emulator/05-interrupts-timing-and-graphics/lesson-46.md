---
project: build-a-game-boy-emulator
lesson: 46
title: Sprites
overview: Today you add sprites, the moving objects like the player and enemies, compositing them over the background from OAM data while treating color index 0 as transparent. With sprites in place every visible element of a game is finally on screen.
goal: Draw an 8x8 sprite from OAM over the background, treating color index 0 as transparent.
spec:
  scenario: Drawing a sprite over the background
  status: failing
  lines:
    - kw: Given
      text: OBP0 is 0xE4, OAM entry 0 has Y=16, X=8, tile=1, and tile 1's top-left pixel is index 2 with the rest index 0
    - kw: When
      text: sprites are composited onto a background of shade 0
    - kw: Then
      text: screen pixel (0,0) is shade 2 (index 2 mapped through OBP0=0xE4)
    - kw: And
      text: the sprite's index-0 pixels stay transparent, leaving the background shade 0 beneath them
code:
  lang: go
  source: |
    // OAM lives at 0xFE00: 40 entries of 4 bytes (Y, X, tile, attributes). Read an
    // entry with mem.Read, just like tileMapEntry reads the map. A sprite at OAM
    // Y=16, X=8 lands at screen (0,0): screenY = Y-16, screenX = X-8.
    // Reuse tilePixel (the same unsigned 0x8000 tile addressing as the background):
    idx := p.tilePixel(s.tile, px, py)
    if idx != 0 { // color index 0 is transparent for sprites
        fb[sy][sx] = shade(p.obp0, idx)
    }
reading: 'OAM sprites - 40 objects, the Y-16/X-8 offset, and index-0 transparency.'
checkpoint: Sprites now composite over the background with transparency. Commit and stop here.
---

**Sprites** (the hardware calls them *objects*) are the moving pieces - the
player, enemies, the falling blocks. Their positions live in **OAM** at `0xFE00`,
40 entries of four bytes each: Y, X, tile number, and attributes. The positions
carry a fixed offset so sprites can slide partly off-screen: a sprite at `Y=16,
X=8` draws at screen `(0, 0)`, so you subtract 16 and 8 to find where it lands.

The rule that makes sprites look right is **transparency**: color index 0 is not
drawn at all, letting the background show through. So you composite in two passes
- background first, then sprites on top, skipping their index-0 pixels. Sprites
use their own palettes (`OBP0`/`OBP1`) rather than `BGP`. Add these and every
visible element of a game is on screen; all that is left is to make it run.
