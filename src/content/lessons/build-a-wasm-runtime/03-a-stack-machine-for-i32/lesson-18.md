---
project: build-a-wasm-runtime
lesson: 18
title: i32 division and remainder
overview: 'Division is where WebAssembly first traps on bad input and where signed and unsigned diverge. Today you add the four division instructions, truncating toward zero and trapping on divide-by-zero and overflow.'
goal: Execute i32.div_s, i32.div_u, i32.rem_s, and i32.rem_u with correct truncation and trapping.
spec:
  scenario: Signed and unsigned division with traps
  status: failing
  lines:
    - kw: Given
      text: the interpreter with two i32 operands on the stack
    - kw: When
      text: a division or remainder instruction executes
    - kw: Then
      text: 'div_s truncates toward zero so -7 / 2 = -3, and rem_s takes the sign of the dividend so -7 rem 2 = -1'
    - kw: And
      text: 'div_u treats operands as unsigned so 0xFFFFFFFF div_u 2 = 2147483647; dividing by zero traps, and div_s of -2147483648 by -1 traps (overflow)'
code:
  lang: go
  source: |
    // div_s/rem_s use signed operands; div_u/rem_u use unsigned. Two traps:
    // divisor == 0 always, and the signed overflow INT_MIN / -1.
    case 0x6D: // i32.div_s
      b := popI32(); a := popI32()
      if b == 0 { return errDivZero }
      if a == -2147483648 && b == -1 { return errOverflow }
      stack.Push(I32(a / b))
    // 0x6E div_u, 0x6F rem_s, 0x70 rem_u
checkpoint: The engine divides with correct truncation and traps. Commit and stop here.
---

Division introduces two ideas at once, both essential. First, **truncation direction**: WebAssembly rounds signed division toward zero, so `-7 / 2` is `-3`, not the floor `-4`, and the remainder takes the sign of the **dividend**, so `-7 rem 2` is `-1`. Most languages' native integer division already truncates toward zero, but it is worth confirming rather than assuming. Second, **signedness**: `div_u` and `rem_u` reinterpret the same 32 bits as unsigned, so `0xFFFFFFFF` is `4294967295`, not `-1`, and `0xFFFFFFFF div_u 2` is `2147483647`.

Division is also the first place the engine **traps** on the values themselves rather than on a malformed body. Dividing by zero traps, always. And there is one sharp signed overflow: `-2147483648 / -1` would be `2147483648`, which does not fit in an `i32`, so it traps too - a case a naive implementation using native division might crash on or return the wrong value for. Note the asymmetry to get right: `-2147483648 rem -1` does **not** trap, it is `0`. Pinning these edges keeps the operation honest at exactly the inputs that break careless code.
