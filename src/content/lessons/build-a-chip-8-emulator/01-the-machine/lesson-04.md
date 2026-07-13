---
project: build-a-chip-8-emulator
lesson: 4
title: The 64x32 framebuffer
overview: CHIP-8's screen is a tiny 64x32 grid of pixels that are either on or off. Today you build that framebuffer with pixel set, get, and clear, the surface every draw instruction will paint onto.
goal: Build a 64x32 monochrome framebuffer with set-pixel, get-pixel, and clear.
spec:
  scenario: Pixels turn on, read back, and clear
  status: failing
  lines:
    - kw: Given
      text: 'a new VM with a blank display'
    - kw: When
      text: 'the pixel at column 10, row 5 is set on'
    - kw: Then
      text: 'reading that pixel returns on (true) and the pixel at column 0, row 0 reads off (false)'
    - kw: And
      text: 'after ClearDisplay every one of the 64x32 pixels reads off'
code:
  lang: go
  source: |
    const (W, H = 64, 32)
    type VM struct {
      // ... mem, V ...
      display [W * H]bool // row-major: index = y*W + x
    }
    func (v *VM) SetPixel(x, y int, on bool) { v.display[y*W+x] = on }
    func (v *VM) GetPixel(x, y int) bool { return v.display[y*W+x] }
    func (v *VM) ClearDisplay() { v.display = [W * H]bool{} }
checkpoint: The VM has a 64x32 framebuffer you can set, read, and clear. Commit and stop here.
---

CHIP-8 draws to a **monochrome** display just 64 pixels wide and 32 pixels tall. Each pixel is a single bit: on or off, nothing in between. That makes the framebuffer a flat grid of `64 * 32 = 2048` cells, and every graphics instruction the machine has ultimately reduces to flipping cells in this grid.

Store it however you like as long as `(x, y)` maps to one cell - a row-major array indexed by `y*64 + x` is the simplest. The three operations you build today are the whole display API: turn a pixel on or off, ask whether one is on, and blank the entire screen. The `00E0` opcode will call clear, and the `DXYN` draw opcode will call set thousands of times, but neither needs anything more than this.
