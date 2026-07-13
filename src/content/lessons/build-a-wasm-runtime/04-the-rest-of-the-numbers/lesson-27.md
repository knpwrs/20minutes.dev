---
project: build-a-wasm-runtime
lesson: 27
title: Float comparison and conversion
overview: 'Floats compare into the same 0-or-1 booleans as integers, but NaN makes its own rules, and converting a float to an integer can trap. Today you add float comparison and the float-to-integer conversion.'
goal: Execute the f64 comparisons and i32.trunc_f64_s, pinning NaN behavior and the out-of-range trap.
spec:
  scenario: Comparing floats and converting to integers
  status: failing
  lines:
    - kw: Given
      text: the interpreter with f64 operands on the stack
    - kw: When
      text: 'an f64 comparison or i32.trunc_f64_s executes'
    - kw: Then
      text: 'f64.lt(1.0, 2.0) = 1, but every comparison with NaN is false so f64.eq(NaN, NaN) = 0 and f64.ne(NaN, NaN) = 1'
    - kw: And
      text: 'i32.trunc_f64_s truncates toward zero so 3.7 -> 3 and -3.7 -> -3, but a NaN or out-of-range input traps'
code:
  lang: go
  source: |
    // f64 comparisons push i32 0/1 like the integer ones. NaN compares as
    // "unordered": every ordered test is false, so only ne(NaN,NaN) is true.
    case 0x61: // f64.eq
      b := popF64(); a := popF64(); stack.Push(boolI32(a == b))
    case 0xAA: // i32.trunc_f64_s
      a := popF64()
      if math.IsNaN(a) || a >= 2147483648.0 || a < -2147483648.0 { return errTrap }
      stack.Push(I32(int32(a)))
    // 0x62 ne, 0x63 lt, 0x64 gt, 0x65 le, 0x66 ge
checkpoint: The engine compares floats and converts them to integers with a trap on bad input. Commit and stop here.
---

Float comparisons push the same `i32` `0` or `1` as the integer ones, so they slot straight into the boolean convention you already have - `f64.lt(1.0, 2.0)` is `1`. The wrinkle is **NaN**, which is defined to be **unordered**: it is neither less than, greater than, nor equal to anything, including itself. So every ordered comparison with a `NaN` operand is false, which makes `f64.eq(NaN, NaN)` come out `0`, and `f64.ne(NaN, NaN)` the one that comes out `1`. That `x != x` is true exactly when `x` is `NaN` is the classic float gotcha, and a correct runtime must reproduce it.

Converting a float to an integer is where floats trap. `i32.trunc_f64_s` rounds **toward zero**, so `3.7` becomes `3` and `-3.7` becomes `-3` - it drops the fraction, it does not round to nearest. But a float can hold values an `i32` cannot: infinity, `NaN`, or anything past the 32-bit range. Those cannot be represented, so the conversion **traps** rather than producing garbage. Checking `NaN` and the range bounds before converting is what keeps the operation honest; the other trunc and convert variants follow the same shape and are finished in the finalize pass.
