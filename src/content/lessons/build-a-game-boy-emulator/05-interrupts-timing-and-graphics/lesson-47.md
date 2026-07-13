---
project: build-a-game-boy-emulator
lesson: 47
title: The joypad
overview: Today you implement the joypad register, the quirky active-low, matrixed input scheme that packs eight buttons into four data bits selected by row. This is the last hardware register your emulator needs before everything runs together.
goal: Implement the 0xFF00 joypad register with its active-low, matrixed button rows.
spec:
  scenario: Reading a pressed direction
  status: failing
  lines:
    - kw: Given
      text: the Right button is held and 0x20 is written to 0xFF00 (selecting the direction pad)
    - kw: When
      text: 0xFF00 is read back
    - kw: Then
      text: bit 0 reads 0 (pressed is low) and bit 4 reads 0 (directions selected)
    - kw: And
      text: writing 0x10 instead (selecting buttons) makes bit 0 read 1, since Right is not a button
code:
  lang: go
  source: |
    func (j *Joypad) Read() uint8 {
        var low uint8 = 0x0F // nothing pressed = all high
        if j.selectDir { low &^= j.dirBits }   // pressed bits pulled to 0
        if j.selectBtn { low &^= j.btnBits }
        return j.sel | low
    }
reading: 'The P1/JOYP register at 0xFF00 - active-low buttons in two selectable rows.'
checkpoint: The joypad now reports pressed keys through the select bits. Commit and stop here.
---

Input comes through a single register, `P1`/`JOYP` at `0xFF00`, and it is
delightfully backwards in two ways. First, it is **active-low**: a bit reads `0`
when its button is **pressed**, `1` when released. Second, eight buttons share
only four data bits through a **matrix**: you write bit 4 or bit 5 to *select*
whether the low nibble reports the direction pad or the action buttons, then read
the result.

So to check the D-pad, select it (bit 4 low) and read: `Right` is bit 0,
`Left` bit 1, `Up` bit 2, `Down` bit 3. Select the buttons instead (bit 5 low)
and the same four data bits now mean `A`, `B`, `Select`, `Start`. Model the
pressed state internally and let the select bits choose which half to expose.
This is the last hardware register your emulator needs - next, everything runs
together.
