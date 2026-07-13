---
project: build-a-game-boy-emulator
lesson: 44
title: Rendering a scanline
overview: Today you bring together the tile map, tile-data addressing, decoding, and palette lookup to render one full 160-pixel background scanline (with no scroll yet). Get one line right and a full frame is just this same routine run 144 times.
goal: Render one background scanline of 160 pixels at scroll 0, combining the tile-map lookup, tile-data addressing, decoding, and palette.
spec:
  scenario: Drawing one line of the background
  status: failing
  lines:
    - kw: Given
      text: SCX and SCY are 0, the tile map at 0x9800 selects tile 1 everywhere, and tile 1 is filled with color index 3
    - kw: When
      text: background scanline LY=0 is rendered with BGP=0xE4
    - kw: Then
      text: the scanline is 160 pixels wide
    - kw: And
      text: every pixel on the line has shade 3
code:
  lang: go
  source: |
    func (p *PPU) renderLine(ly uint8) [160]uint8 {
        var line [160]uint8
        for x := 0; x < 160; x++ { // no scroll yet - SCX = SCY = 0
            // tile map: a 32x32 grid of tile numbers at 0x9800
            tile := p.mem.Read(0x9800 + uint16(ly/8)*32 + uint16(x/8))
            // tile DATA (unsigned mode): 16 bytes per tile, 2 bytes per row
            base := 0x8000 + uint16(tile)*16 + uint16(ly%8)*2
            row := decodeRow(p.mem.Read(base), p.mem.Read(base+1))
            line[x] = shade(p.bgp, row[x%8])
        }
        return line
    }
reading: 'Background rendering - the 32x32 tile map at 0x9800 and tile data at 0x8000 (16 bytes/tile). Scroll (SCX/SCY) is left at 0 today.'
checkpoint: One background scanline now renders end to end at scroll 0. Applying the SCX/SCY offsets is a natural next extension. Commit and stop here.
---

Now the pieces converge into an actual picture. The background is a 32×32 grid of
tile numbers - the **tile map** at `0x9800` - describing which tile sits where. A
tile number then has to become tile *data*: in the standard unsigned mode, tile
`n`'s bytes live at `0x8000 + n*16`, with 2 bytes per row (so row `r` starts at
`+ r*2`). That tile-data addressing is the new idea today; the map lookup, the
decode from lesson 42, and the palette from lesson 43 you already have.

To render scanline `LY`, walk `x` from 0 to 159: find the tile-map cell, read the
tile number, address its data, decode the pixel, and run the index through `BGP` -
160 finished shades. Keep `SCX`/`SCY` at 0 for now; those **scroll** offsets
(which slide a world larger than the screen past the window) are an easy extension
once the un-scrolled line is right. Get one line right and the full frame is just
this same routine run 144 times.
