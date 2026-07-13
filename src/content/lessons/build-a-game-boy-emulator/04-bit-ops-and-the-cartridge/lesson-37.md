---
project: build-a-game-boy-emulator
lesson: 37
title: Bank switching
overview: Today you implement bank switching, the trick that lets a cartridge far bigger than the 32 KB address window still fit by swapping chunks of ROM into view on demand. This is what lets your emulator load real, full-size games instead of just tiny ones.
goal: Implement MBC1 ROM banking so a write to the bank-select range chooses which bank appears at 0x4000.
spec:
  scenario: Selecting a ROM bank
  status: failing
  lines:
    - kw: Given
      text: a ROM larger than 32 KB where bank 2 begins with the byte 0xAA
    - kw: When
      text: the value 0x02 is written to address 0x2000
    - kw: Then
      text: reading address 0x4000 returns 0xAA (bank 2, first byte)
    - kw: And
      text: reading address 0x0100 still returns bank 0 (the fixed low bank)
code:
  lang: go
  source: |
    // writes to 0x2000..0x3FFF pick the bank for the 0x4000..0x7FFF window
    case addr >= 0x2000 && addr < 0x4000:
        m.romBank = v & 0x1F
        if m.romBank == 0 { m.romBank = 1 }
    // reads at 0x4000..0x7FFF index into rom[bank*0x4000 + (addr-0x4000)]
reading: 'MBC1 - the most common memory-bank controller and its 0x2000 bank register.'
checkpoint: ROM bank switching now maps the high window to any bank. Chapter four is done - you can load a real banked game. Commit and stop.
---

A 32 KB address window cannot hold a 256 KB game, so cartridges include a
**memory-bank controller** (MBC) - a chip that swaps chunks of ROM into view.
With **MBC1**, the low bank at `0x0000`–`0x3FFF` is fixed to bank 0, while the
window at `0x4000`–`0x7FFF` shows a **switchable** bank, drawn from the full
cartridge slice you kept in `Memory.rom` on lesson 36 - index it at
`rom[bank*0x4000 + (addr-0x4000)]`. Writing a bank number to the `0x2000`–`0x3FFF`
range selects which one appears there - a write that looks like it targets ROM
but is really a control signal to the chip.

One gotcha: bank `0` requested in that register actually maps to bank `1`,
because bank 0 is already permanently visible in the low window. Note this
intercept only applies once a real multi-bank cartridge is loaded - a bare memory
with no ROM keeps the plain behavior from lesson 35, so nothing you built earlier
breaks. With banking working, your emulator can load real, full-size games - not
just tiny 32 KB ones.
The CPU is complete and the cartridge is mounted; all that remains is to bring
the hardware to life so a game has something to draw on.
