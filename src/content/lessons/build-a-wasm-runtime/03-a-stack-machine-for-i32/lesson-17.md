---
project: build-a-wasm-runtime
lesson: 17
title: i32 add, subtract, and multiply
overview: 'The first real computation: pop two operands, combine them, push the result. Today you add the three basic i32 arithmetic instructions and pin how they wrap around at 32 bits.'
goal: Execute i32.add, i32.sub, and i32.mul, each wrapping its result to 32 bits.
spec:
  scenario: Wrapping 32-bit arithmetic
  status: failing
  lines:
    - kw: Given
      text: the interpreter with two i32 operands on the stack
    - kw: When
      text: 'i32.add, i32.sub, or i32.mul executes'
    - kw: Then
      text: '2 + 3 = 5, 10 - 3 = 7, and 3 * 4 = 12'
    - kw: And
      text: 'results wrap modulo 2^32: 0x7FFFFFFF + 1 = -2147483648 (0x80000000), and 0x40000000 * 4 = 0'
code:
  lang: go
  source: |
    // Each binary op pops b then a (b was pushed last), computes, and pushes.
    // 32-bit two's-complement wrap is automatic if you compute in uint32/int32.
    case 0x6A: // i32.add
      b := popI32(); a := popI32(); stack.Push(I32(a + b))
    case 0x6B: /* i32.sub: a - b */
    case 0x6C: /* i32.mul: a * b */
checkpoint: The engine does wrapping 32-bit add, subtract, and multiply. Commit and stop here.
---

These three share one shape - pop two, combine, push one - and together they are the arithmetic core every later numeric feature builds on. The only subtlety worth care is **operand order**: the second operand was pushed last, so it comes off the stack first. For `a - b` you pop `b`, then pop `a`, then push `a - b`. Getting that backwards is invisible for `add` and `mul` but silently wrong for `sub`.

The edge that must be pinned is **wraparound**. WebAssembly's `i32` is exactly 32-bit two's-complement arithmetic modulo 2^32, so `0x7FFFFFFF + 1` is not `2147483648` - that does not fit - it wraps to `-2147483648` (`0x80000000`), and `0x40000000 * 4` overflows every set bit out the top and lands on `0`. In a language with fixed-width 32-bit integers this wrap is automatic; in one without, you must mask back to 32 bits yourself. Pinning the boundary now, not just a mid-range `2 + 3`, is what keeps the spec correct for every language a learner might use.
