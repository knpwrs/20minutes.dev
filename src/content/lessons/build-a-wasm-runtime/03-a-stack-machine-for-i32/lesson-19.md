---
project: build-a-wasm-runtime
lesson: 19
title: i32 bitwise and, or, xor
overview: 'Bitwise logic is the plumbing behind flags, masks, and packed data. Today you add the three i32 bit operations, each combining its operands bit by bit.'
goal: Execute i32.and, i32.or, and i32.xor over the low 32 bits of their operands.
spec:
  scenario: Combining operands bit by bit
  status: failing
  lines:
    - kw: Given
      text: the interpreter with two i32 operands on the stack
    - kw: When
      text: 'i32.and, i32.or, or i32.xor executes'
    - kw: Then
      text: '0xF0 and 0x0F = 0, 0xF0 or 0x0F = 0xFF (255), and 0xFF xor 0x0F = 0xF0 (240)'
    - kw: And
      text: each operates on all 32 bits, so the result depends only on the bit patterns, not on how they are interpreted as signed or unsigned
code:
  lang: go
  source: |
    // Same pop-two, push-one shape as arithmetic. Bitwise ops don't care about
    // sign - they work directly on the 32-bit pattern.
    case 0x71: // i32.and
      b := popI32(); a := popI32(); stack.Push(I32(a & b))
    case 0x72: /* i32.or:  a | b */
    case 0x73: /* i32.xor: a ^ b */
checkpoint: The engine does bitwise and, or, and xor. Commit and stop here.
---

The three **bitwise** instructions follow the same pop-two-push-one shape as arithmetic, but they combine their operands one bit position at a time: `and` keeps a bit only where both inputs have it, `or` where either does, `xor` where exactly one does. So `0xF0 and 0x0F` clears everything to `0`, `0xF0 or 0x0F` fills to `0xFF`, and `0xFF xor 0x0F` flips the low nibble to give `0xF0`. These are the building blocks for masking fields out of packed values, testing and toggling flags, and the shift-and-mask idioms compiled code leans on constantly.

Unlike division, sign is irrelevant here: the operation is defined purely on the 32-bit pattern, so there is no `_s`/`_u` split and no trap. That makes these among the easiest opcodes to add, which is exactly why they earn one short lesson - they round out the arithmetic-logic core before you move on to the shifts, where the operand's interpretation starts to matter again.
