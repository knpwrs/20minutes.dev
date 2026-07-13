---
project: build-a-wasm-runtime
lesson: 24
title: i64 arithmetic
overview: 'The 64-bit integer type is the i32 family at double the width. Today you add i64 constants and arithmetic, reusing your value slot and pinning the wrap at the 64-bit boundary.'
goal: Execute i64.const and the i64 add, subtract, and multiply instructions, wrapping at 64 bits.
spec:
  scenario: 64-bit arithmetic and wraparound
  status: failing
  lines:
    - kw: Given
      text: the interpreter with i64 operands on the stack
    - kw: When
      text: 'i64.const, i64.add, i64.sub, or i64.mul executes'
    - kw: Then
      text: 'i64.const decodes a signed LEB128 of up to 64 bits, and 2 + 3 = 5'
    - kw: And
      text: 'results wrap modulo 2^64: 0x7FFFFFFFFFFFFFFF + 1 = -9223372036854775808'
code:
  lang: go
  source: |
    // Your value slot already holds 64 bits, so i64 needs no new storage - just
    // new opcodes that read and write the full width. i64.const is 0x42.
    case 0x42: // i64.const
      v, err := readVarS64(body, &pc) // signed LEB128, up to 64 bits
      stack.Push(I64(v))
    // 0x7C i64.add, 0x7D i64.sub, 0x7E i64.mul
checkpoint: The engine does 64-bit constants and arithmetic. Commit and stop here.
---

Because you built the value slot to hold 64 bits from the start, `i64` needs **no new storage** - only new opcodes that read and write the full width instead of the low half. `i64.const` (`0x42`) decodes a **signed LEB128**, exactly like `i32.const` but allowed to run up to 64 bits of value, and `i64.add`, `i64.sub`, `i64.mul` are the same pop-two-push-one arithmetic you wrote for `i32`, just at the wider type. This is the payoff of picking a general representation early: widening the integer type is additive, not a refactor.

The boundary to pin is the wider wrap. Where `i32` overflows past 2^31, `i64` overflows past 2^63, so `0x7FFFFFFFFFFFFFFF + 1` wraps from the largest positive value to the smallest negative one, `-9223372036854775808`. The same modulo-2^width two's-complement rule you learned for `i32` applies here at double the width. If your language has a native 64-bit integer this is automatic; if it does not, the same masking discipline extends to 64 bits. The i64 division, comparison, and bit operations follow the identical i32 pattern and are completed in the finalize pass.
