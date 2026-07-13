---
project: build-a-game-boy-emulator
lesson: 27
title: Restart vectors
overview: Today you implement RST 0x00, a compact one-byte call to a fixed vector that reuses the stack machinery you already built - the very mechanism interrupts will lean on in the next chapter. It is the small, focused addition that rounds out control flow.
goal: Implement RST 0x00 (a one-byte call to a fixed vector) and run a program that calls a subroutine and returns.
spec:
  scenario: A one-byte call to a fixed vector
  status: failing
  lines:
    - kw: Given
      text: PC is 0x0100, SP is 0xFFFE, and memory at 0x0100 holds 0xC7
    - kw: When
      text: RST 0x00 (opcode 0xC7) runs
    - kw: Then
      text: PC is 0x0000 and the return address 0x0101 is on the stack
    - kw: And
      text: the step reports 16 cycles
code:
  lang: go
  source: |
    case 0xC7: // RST 0x00
        c.push16(c.PC)     // PC already past the 1-byte opcode
        c.PC = 0x0000
        return 16
    // RST 0x08,0x10,...0x38 jump to those fixed low addresses
reading: 'RST - one-byte calls to eight fixed vectors, also used by interrupts.'
checkpoint: The spec now works and RST performs a one-byte call to its fixed vector, reusing the push machinery from CALL. Chapter three is done. Commit and stop.
---

`RST` (opcode `0xC7` and its seven siblings) is a compact, one-byte `CALL` to one
of eight **fixed vectors** at `0x00`, `0x08`, `0x10`, and so on up to `0x38`. It
pushes the return address like any call, then jumps to its hardwired low address.
Games use them as fast calls to common routines, and - importantly - the
interrupt system reuses the exact same mechanism to jump into handlers, which you
will meet in the final chapter.

You now have everything for real control flow: jumps, conditional branches, the
stack, calls, returns, and restarts. Celebrate by assembling a program with an
actual **subroutine** - call it, let it run, watch `RET` bring you back - and
confirm the final state. That is a genuine structured program running on a CPU
you built from a single register up.
