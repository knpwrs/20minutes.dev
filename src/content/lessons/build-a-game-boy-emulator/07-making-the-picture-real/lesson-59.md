---
project: build-a-game-boy-emulator
lesson: 59
title: Reading the joypad
overview: Lesson 47 built the joypad's read logic, but nothing is wired to it, reads of 0xFF00 hit plain memory and no button does anything. Today you connect the joypad to the 0xFF00 register and raise its interrupt when a button goes down, so a ROM can finally read the controller and respond to input.
goal: Route 0xFF00 reads through the joypad, and request the joypad interrupt (IF bit 4) when a button is newly pressed.
spec:
  scenario: The joypad answers through 0xFF00 and interrupts on a press
  status: failing
  lines:
    - kw: Given
      text: a machine whose Down button is held, with the ROM having selected the direction group by writing to 0xFF00 (direction-select bit low)
    - kw: When
      text: the CPU reads 0xFF00 through memory
    - kw: Then
      text: the Down bit reads 0 (pressed is active-low, per lesson 47) and the other buttons in that group read 1
    - kw: And
      text: pressing a button that was up sets the joypad interrupt request — IF bit 4 (0x10)
    - kw: And
      text: with the joypad untouched, unrelated memory reads and writes behave exactly as before
code:
  lang: go
  source: |
    // Make Memory.Read of 0xFF00 return the joypad's computed value (lesson 47's
    // active-low select+state logic) instead of the backing array. Give the joypad a
    // press(button)/release(button) API; on a press that was previously up, set bit 4
    // of IF (0xFF0F). Everything OUTSIDE 0xFF00 keeps hitting the array as before, so
    // wire the joypad into Memory (and the GameBoy) without disturbing other reads.
reading: 'Wiring the joypad — 0xFF00 through the controller, and the joypad interrupt (IF bit 4).'
checkpoint: The joypad now answers through 0xFF00 and a press wakes the ROM through its interrupt. Input finally reaches the game. Commit and stop here.
---

On lesson 47 you built the joypad register's logic: the ROM writes `0xFF00` to select
the directions or the action buttons, and reads back the low four bits with **0
meaning pressed**. But that logic sat off to the side, `0xFF00` in memory was just
another byte, and no button press went anywhere. Today you plug it in.

Two connections do it. First, a read of `0xFF00` must return the joypad's computed
value rather than the raw memory cell, so route that one address through the
joypad while every other address keeps hitting memory untouched. Second, the moment
a button transitions from up to down, set bit 4 of `IF`, the joypad interrupt, so a
ROM sleeping in `HALT` wakes to check input. With both wired, the controller is real:
the program can poll `0xFF00`, and a keypress can pull it straight to its input
handler.
