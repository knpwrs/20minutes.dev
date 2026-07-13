---
project: build-a-game-boy-emulator
lesson: 50
title: Incrementing any register
overview: On lesson 15 you gave INC and DEC to register B. Loops and pointer walks bump every register, so today you generalize INC r and DEC r to all of them using the same register-field decode you just built. Counting is everywhere in real code, so this closes another gap on the way to a booting ROM.
goal: Generalize INC r and DEC r to every register, reusing the register-field decode and the 8-bit flag rules from lesson 15.
spec:
  scenario: Incrementing and decrementing registers other than B
  status: failing
  lines:
    - kw: Given
      text: C is 0x0F and E is 0x00, with the carry flag set
    - kw: When
      text: INC C (opcode 0x0C) runs
    - kw: Then
      text: C is 0x10 with the half-carry flag set, N clear, and C (carry) still set
    - kw: And
      text: DEC E (opcode 0x1D) then makes E 0xFF with N set, the half-carry set, and carry still untouched
code:
  lang: go
  source: |
    // INC r is 0x04 | (reg<<3); DEC r is 0x05 | (reg<<3) - same 3-bit register
    // field as LD r, n (index 6 is (HL), an in-place memory read-modify-write).
    // You have setReg from yesterday; add its read-side mirror getReg (the same
    // switch over indices, index 6 reads (HL)). With both, reuse lesson 15's flags:
    //   INC: Z from result, N cleared, H when the low nibble was 0xF, C untouched.
    //   DEC: Z from result, N set,     H when the low nibble was 0x0, C untouched.
reading: 'The INC r / DEC r blocks - the same register field as LD r, n, with the 8-bit flag rules.'
checkpoint: INC and DEC now work on any register, carry left alone. Loops that count in C, DE, or HL bytes run correctly. Commit and stop here.
---

Lesson 15 built `INC B` and `DEC B`; the flag rules there - set `Z`/`H`, leave the
carry alone - are the whole story. What is missing is the other seven targets.
Real code counts loop variables in `C`, walks buffers through a pointer in `HL`,
and steps counters in `D` or `E`, so every register needs `INC` and `DEC`.

The opcodes sit at `0x04`/`0x05` plus the now-familiar register field in bits
3–5, so this is the same decode you wrote yesterday wrapped around lesson 15's flag
logic - no new arithmetic to derive, just applied to a decoded register. Watch
the one subtlety carried over from lesson 15: these are the ops that deliberately
**preserve the carry flag**, so a counting loop can still test a carry set
earlier.
