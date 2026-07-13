---
project: build-a-game-boy-emulator
lesson: 51
title: Direct memory loads
overview: So far the CPU reaches memory only through HL or the fixed LDH high page. Boot code also reads and writes arbitrary 16-bit addresses directly - to enable the LCD, set palettes, or start a transfer. Today you add absolute addressing so a ROM can touch any of its own hardware registers by address.
goal: Add the absolute loads LD (nn),A and LD A,(nn) - reading and writing any 16-bit address.
spec:
  scenario: Storing and loading through an absolute address
  status: failing
  lines:
    - kw: Given
      text: A is 0x42 and memory at 0x0100 holds 0xEA, 0x00, 0xC0 (LD (0xC000), A)
    - kw: When
      text: one step runs
    - kw: Then
      text: memory at 0xC000 holds 0x42, PC is 0x0103, and the step reported 16 cycles
    - kw: And
      text: LD A, (nn) (opcode 0xFA) reads a byte back from an absolute address into A, also in 16 cycles
code:
  lang: go
  source: |
    // LD (nn),A (0xEA): fetch a little-endian 16-bit address (low byte first),
    // then write A there - 16 cycles, no flags touched.
    // LD A,(nn) (0xFA): the reverse - read that absolute address into A.
    // (The register-indexed high-page forms LD (C),A / LD A,(C) at 0xFF00+C are an
    //  easy follow-on once these work - same shape as lesson 21's LDH.)
reading: 'Absolute loads - LD (nn),A / LD A,(nn) fetch a little-endian 16-bit address.'
checkpoint: The CPU can now read and write any address directly, not just via HL or the fixed high page. Commit and stop here.
---

Your loads so far go through `HL` or the fixed high page (`LDH`). But a boot
sequence pokes specific hardware registers by their full address - enabling the
LCD, setting palettes, kicking off a transfer - so the CPU needs plain absolute
addressing.

`LD (nn), A` fetches a **little-endian 16-bit address** from the two bytes after
the opcode (low byte first) and stores `A` there; `LD A, (nn)` reads it back.
They are pure data moves - no flags change - but they are what finally let a
program reach across its whole address space instead of just the corners you had
wired. The register-indexed `LD (C), A` / `LD A, (C)` (address `0xFF00 + C`) are
the same idea as lesson 21's `LDH` and drop in easily once these are green.
