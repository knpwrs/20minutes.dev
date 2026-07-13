---
project: build-a-game-boy-emulator
lesson: 60
title: A moving picture
overview: Everything in this chapter has been a piece of one thing, a screen that lives. Today you prove it, assembling a small program that paces itself to VBlank and animates the display every frame, scrolling the background and sliding a sprite, while the controller reads live. No new hardware, just the payoff, a Game Boy that moves.
goal: Run a small VBlank-driven demo that scrolls the background and moves a sprite each frame, and confirm the controller reads live.
spec:
  scenario: A VBlank loop animates the screen and the pad is live
  status: failing
  lines:
    - kw: Given
      text: a program that enables the VBlank interrupt, sets IME, and loops on HALT, whose VBlank handler increments SCX (0xFF43) and increments a visible sprite's OAM X, then returns with RETI — plus a background in VRAM and that sprite in OAM starting at X = V, with SCX = 0
    - kw: When
      text: the emulator runs two frames
    - kw: Then
      text: SCX is 2 and the sprite's OAM X is V + 2 (the handler ran once per frame), and the rendered frame reflects the scrolled background and the sprite's new position
    - kw: And
      text: with the Right button held and the direction group selected, reading 0xFF00 shows Right pressed (active-low) and the joypad interrupt was requested — the controller is live
code:
  lang: go
  source: |
    // No new hardware today — assemble what the chapter built. The VBlank handler is
    // a few instructions: LDH A,(0x43); INC A; LDH (0x43),A to bump SCX, then read /
    // increment / write the sprite's OAM X byte (0xFE00 + entry*4 + 1), then RETI.
    // Main: enable VBlank in IE, EI, HALT-loop (as on lesson 54). Run two frames and
    // assert SCX==2 and OAM X==V+2. Then, separately, press Right, select the
    // direction group, and check 0xFF00 reads it pressed with IF bit 4 set.
reading: 'The whole picture — a VBlank loop driving scroll and sprites, with the pad wired in.'
checkpoint: Your emulator boots a program that animates a scrolling background and a moving sprite every frame and reads the controller live. You built a Game Boy that moves — see the "Scope & extensions" notes for where to take it next. Commit — the project is done.
---

Nothing new to build today. This chapter turned a static, wrong picture into a
live one, the background follows the ROM's scroll and map choice, the palette is
whatever the ROM programs, sprites flip and pick their colors and land in the
frame, the timer and joypad raise their interrupts, and input reads through
`0xFF00`. Today you watch it all run at once.

Assemble a small program in the lesson-54 shape, enable the VBlank interrupt, turn on
`IME`, and loop on `HALT`, but give its VBlank handler real work: nudge `SCX` and
the sprite's OAM position by one each frame. Run two frames and the numbers move,
the world has scrolled and the sprite has slid, both showing up in the rendered
picture. Then hold a button and read the pad to see it answer. That handshake,
frame after frame, drawing a moving scene and taking input, is a Game Boy. The
scope notes below are honest about the polish still ahead, cycle-exact timing,
sound, more mappers, but the machine in front of you runs, renders, and responds.
