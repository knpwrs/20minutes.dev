---
project: build-a-wasm-runtime
lesson: 22
title: i32 equality tests
overview: 'Comparisons turn numbers into the 0-or-1 booleans that control flow will branch on. Today you add the three equality tests, which always push either 0 or 1.'
goal: Execute i32.eqz, i32.eq, and i32.ne, each pushing an i32 that is 1 for true and 0 for false.
spec:
  scenario: Testing values for equality
  status: failing
  lines:
    - kw: Given
      text: the interpreter with i32 operands on the stack
    - kw: When
      text: 'i32.eqz, i32.eq, or i32.ne executes'
    - kw: Then
      text: 'eqz(0) = 1 and eqz(5) = 0, eq(3, 3) = 1 and eq(3, 4) = 0, and ne(3, 4) = 1'
    - kw: And
      text: every result is the i32 value 0 or 1, never a wider boolean
code:
  lang: go
  source: |
    // Comparisons push an i32: 1 for true, 0 for false. eqz is unary
    // ("equals zero?"); eq and ne are binary.
    case 0x45: // i32.eqz
      a := popI32(); stack.Push(boolI32(a == 0))
    // 0x46 eq (a == b), 0x47 ne (a != b)
    func boolI32(b bool) Value { if b { return I32(1) }; return I32(0) }
checkpoint: The engine tests i32 values for equality, pushing 0 or 1. Commit and stop here.
---

WebAssembly has no separate boolean type: a comparison pushes an `i32` that is `1` for true and `0` for false, and control-flow instructions later treat any nonzero value as true. Today's three are the equality tests. `eqz` is unary - "is this value zero?" - which is the idiomatic way to test a result or negate a boolean, so `eqz(0)` is `1` and `eqz(5)` is `0`. `eq` and `ne` are the binary "equal" and "not equal", so `eq(3, 3)` is `1` and `ne(3, 4)` is `1`.

The one rule to hold onto is that the result is always exactly `0` or `1`, packed into a full `i32`. That uniformity is what lets `br_if` and `if` consume a comparison directly without any conversion, and it is why a comparison can feed straight into arithmetic too. Establishing the `boolI32` helper now means every comparison in the next two lessons - the ordered ones, and later the float ones - reuses the same 0-or-1 convention.
