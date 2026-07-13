---
project: build-a-game-boy-emulator
lesson: 40
title: Servicing an interrupt
overview: Today you make the interrupt gate actually open - when an interrupt is both enabled and pending, the CPU disables further interrupts, pushes the current PC, and jumps to that interrupt's fixed vector, just like a CALL. This is the mechanism that lets a game react to events like VBlank without polling for them.
goal: Dispatch a pending, enabled interrupt by pushing PC and jumping to its fixed vector.
spec:
  scenario: Diverting to the VBlank handler
  status: failing
  lines:
    - kw: Given
      text: IME is true, IE bit 0 is set, IF bit 0 is set, PC is 0x0350, and SP is 0xFFFE
    - kw: When
      text: interrupts are serviced
    - kw: Then
      text: PC is 0x0040 (the VBlank vector), SP is 0xFFFC, and the return address 0x0350 sits on the stack (0x03 at 0xFFFD, 0x50 at 0xFFFC)
    - kw: And
      text: IME is now false and IF bit 0 has been cleared
code:
  lang: go
  source: |
    func (c *CPU) serviceInterrupts() {
        pending := c.mem.Read(0xFFFF) & c.mem.Read(0xFF0F)
        if c.IME && pending&0x01 != 0 { // VBlank
            c.IME = false
            c.clearIF(0)      // acknowledge
            c.push16(c.PC)
            c.PC = 0x0040
        }
    }
reading: 'Interrupt dispatch - the fixed vectors 0x40, 0x48, 0x50, 0x58, 0x60, and RETI.'
checkpoint: A pending interrupt now diverts the CPU to its handler. Commit and stop here.
---

Now the gate actually opens. Between instructions, the CPU checks for a **pending
and enabled** interrupt - `IE & IF` with the corresponding bit set - and if `IME`
is on, it **services** the highest-priority one. Servicing looks exactly like a
`CALL`: disable further interrupts (`IME` off), acknowledge by clearing that
`IF` bit, push the current `PC`, and jump to the interrupt's **fixed vector**.
VBlank's vector is `0x0040`.

The handler ends with `RETI` - a `RET` that also re-enables `IME` - popping the
saved `PC` so the interrupted code resumes as if nothing happened. This is the
mechanism that lets a game react to the screen finishing a frame or a button
being pressed without polling. With it working, the CPU can finally respond to
the hardware you are about to build.
