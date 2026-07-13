---
project: build-a-wasm-runtime
lesson: 26
title: Floating-point arithmetic
overview: 'Floats break two patterns at once: their constants are raw IEEE-754 bytes, not LEB128, and their arithmetic never traps. Today you add f64 constants and the four basic float operations.'
goal: Execute f64.const and the f64 add, subtract, multiply, and divide instructions with IEEE-754 semantics.
spec:
  scenario: IEEE-754 arithmetic with no traps
  status: failing
  lines:
    - kw: Given
      text: the interpreter with f64 operands on the stack
    - kw: When
      text: 'f64.const or an f64 arithmetic instruction executes'
    - kw: Then
      text: 'f64.const reads 8 raw little-endian bytes (00 00 00 00 00 00 F8 3F decodes to 1.5), and 1.5 + 2.5 = 4.0'
    - kw: And
      text: 'float division never traps: 1.0 / 0.0 = positive infinity, and 0.0 / 0.0 = NaN'
code:
  lang: go
  source: |
    // f64.const is NOT LEB128 - it is 8 raw little-endian bytes of the IEEE-754
    // double. Read them, reinterpret the bits as a float, push.
    case 0x44: // f64.const
      raw := readU64LE(body, &pc)      // 8 bytes, little-endian
      stack.Push(F64(math.Float64frombits(raw)))
    // 0xA0 f64.add, 0xA1 f64.sub, 0xA2 f64.mul, 0xA3 f64.div
checkpoint: The engine does IEEE-754 double arithmetic. Commit and stop here.
---

Floating point breaks two habits the integer opcodes built. First, the constant encoding: `f64.const` (`0x44`) is **not** LEB128. It is eight **raw little-endian bytes** of the IEEE-754 double, read verbatim and reinterpreted as a float - so `00 00 00 00 00 00 F8 3F` is the bit pattern for `1.5`. (`f32.const`, `0x43`, is the same idea with four bytes.) Variable-length encoding saves nothing for a value whose bits are effectively random, so the format just stores them flat.

Second, float arithmetic **never traps**. Where `i32.div` guards divide-by-zero, `f64.div` follows IEEE-754: `1.0 / 0.0` is positive infinity, and `0.0 / 0.0` is `NaN` ("not a number"). Add, subtract, and multiply likewise saturate to infinities or produce `NaN` rather than failing. Your value slot already holds the 64 raw bits, so the only new work is reinterpreting them as a float for the operation and back to bits for the stack. Getting infinity and `NaN` out of division instead of a trap is the behavior to confirm - it is the whole difference between integer and float division.
