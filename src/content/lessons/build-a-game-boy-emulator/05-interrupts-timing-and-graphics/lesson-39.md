---
project: build-a-game-boy-emulator
lesson: 39
title: Interrupt enables
overview: Today you wire up the interrupt-enable plumbing - the IME master flag toggled by EI/DI, plus the IE and IF registers that track which interrupt types are allowed and pending. This is the gate that, once opened tomorrow, lets hardware events like VBlank pull the CPU away from its current work.
goal: Model the IME master switch and the IE/IF registers, toggled by the EI and DI instructions.
spec:
  scenario: Enabling and disabling interrupts
  status: failing
  lines:
    - kw: Given
      text: the IME master flag is false
    - kw: When
      text: EI (opcode 0xFB) runs
    - kw: Then
      text: IME is true
    - kw: And
      text: DI (opcode 0xF3) sets IME back to false, and a write of 0x01 to IF (0xFF0F) requests the VBlank interrupt
code:
  lang: go
  source: |
    case 0xFB: // EI - enable interrupts
        c.IME = true
        return 4
    case 0xF3: // DI - disable interrupts
        c.IME = false
        return 4
    // IE at 0xFFFF = which interrupts are allowed; IF at 0xFF0F = which are pending
reading: 'IME, IE (0xFFFF), and IF (0xFF0F) - the three-part interrupt gate.'
checkpoint: Interrupts can now be globally enabled and requested. Commit and stop here.
---

An **interrupt** lets hardware pull the CPU away from its current work to handle
an event. Three things gate one: the **IME** master flag (a single on/off switch
toggled by `EI` and `DI`), the **IE** register at `0xFFFF` (which interrupt
*types* are allowed), and the **IF** register at `0xFF0F` (which are currently
**pending**). An interrupt fires only when IME is on **and** the same bit is set
in both `IE` and `IF`.

Today just wire up the plumbing: the `IME` flag with its two instructions, and
`IE`/`IF` as readable, writable registers. `IE` (`0xFFFF`) and `IF` (`0xFF0F`)
need no new storage - they are just addresses your memory already backs, so a
plain read/write is all they require. Bit 0 of each is **VBlank**, the
interrupt the screen raises 60 times a second - the one your finished emulator
will lean on to pace frames. Tomorrow you make a set request actually divert the
CPU.
