---
project: build-a-game-boy-emulator
lesson: 45
title: The full frame
overview: Today you assemble every scanline from yesterday into a full 160x144 framebuffer, producing your first complete background image at the real DMG resolution. Dump it to a PGM file and you can finally see what your emulator draws.
goal: Assemble all 144 scanlines into a 160x144 framebuffer, then encode it as a viewable PGM image.
spec:
  scenario: Building a whole frame and saving it as an image
  status: failing
  lines:
    - kw: Given
      text: the tile map and tiles that made scanline 0 all shade 3
    - kw: When
      text: a full frame is rendered
    - kw: Then
      text: the framebuffer is 160 by 144 pixels
    - kw: And
      text: the pixel at (0,0) and the pixel at (159,143) are both shade 3
    - kw: And
      text: 'encoding the frame as PGM begins with the header "P5\n160 144\n255\n"'
    - kw: And
      text: a shade-3 pixel becomes byte 0x00 and a shade-0 pixel becomes 0xFF (gray = 255 - shade*85)
code:
  lang: go
  source: |
    func (p *PPU) RenderFrame() [144][160]uint8 {
        var fb [144][160]uint8
        for ly := 0; ly < 144; ly++ {
            fb[ly] = p.renderLine(uint8(ly))
        }
        return fb
    }
    // Then write a P5 (binary) PGM: the header "P5\n160 144\n255\n", followed by
    // one gray byte per pixel. Map shades 0..3 (lightest..darkest) with 255 - shade*85.
    func EncodePGM(fb [144][160]uint8) []byte { /* header + one byte per pixel */ }
reading: 'The 160x144 DMG framebuffer and how a frame is composed from scanlines.'
checkpoint: A complete background frame now renders and saves as a PGM image you can open - your emulator draws a real picture. Commit and stop.
---

A frame is just every visible scanline stacked: loop `LY` from 0 to 143, render
each line with yesterday's routine, and collect them into a **160×144
framebuffer**. That is the exact resolution of the real DMG screen. With this you
can, for the first time, render a complete image the way the hardware does -
background scroll, tiles, and palette all applied.

To actually *see* it, encode the buffer as a **PGM** grayscale image: map each
shade 0–3 to a gray value and write the P5 format (a trivial header plus one byte
per pixel). Open the file and there is your Game Boy background, drawn by code you
wrote. Only two things stand between you and a running game now: sprites on top,
and the loop that drives it all.
