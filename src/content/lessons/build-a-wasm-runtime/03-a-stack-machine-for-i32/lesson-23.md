---
project: build-a-wasm-runtime
lesson: 23
title: i32 ordered comparisons
overview: 'Less-than and greater-than come in signed and unsigned forms, and the difference is the whole point. Today you add the eight ordered comparisons and pin where signed and unsigned disagree, then run a computed expression end to end.'
goal: Execute the eight signed and unsigned ordered comparisons, pinning the case where the two interpretations diverge.
spec:
  scenario: Signed versus unsigned ordering
  status: failing
  lines:
    - kw: Given
      text: the interpreter with two i32 operands on the stack
    - kw: When
      text: an ordered comparison executes
    - kw: Then
      text: 'lt_s(-1, 0) = 1 because -1 is less than 0, but lt_u(-1, 0) = 0 because as unsigned -1 is 0xFFFFFFFF, the largest value'
    - kw: And
      text: 'gt_u(-1, 0) = 1, le_s(3, 3) = 1, and ge_s(4, 3) = 1; the signed ops use the sign, the unsigned ops treat the bits as magnitude'
code:
  lang: go
  source: |
    // Eight ops: {lt, gt, le, ge} x {_s, _u}. The _s forms compare int32,
    // the _u forms compare uint32 - the SAME bits, read two ways.
    case 0x48: // i32.lt_s
      b := popI32(); a := popI32(); stack.Push(boolI32(a < b))
    case 0x49: // i32.lt_u
      b := popU32(); a := popU32(); stack.Push(boolI32(a < b))
    // 0x4A gt_s, 0x4B gt_u, 0x4C le_s, 0x4D le_u, 0x4E ge_s, 0x4F ge_u
checkpoint: The engine compares i32 values with correct signed and unsigned ordering, and can evaluate a full expression. Commit and stop here.
---

The eight ordered comparisons - less-than, greater-than, and their or-equal variants, each in a signed (`_s`) and unsigned (`_u`) form - are all the same pop-two-push-a-boolean shape you already have. What makes them a real lesson rather than boilerplate is that signed and unsigned genuinely **disagree**, and a runtime must honor both. Read the same bits as `int32` and `-1` is the smallest thing there is; read them as `uint32` and `-1` is `0xFFFFFFFF`, the largest. So `lt_s(-1, 0)` is `1` while `lt_u(-1, 0)` is `0`, and `gt_u(-1, 0)` is `1`. This is the same signed-versus-unsigned split you met in division, now deciding order instead of quotient.

Pinning the `-1` case is deliberate: it is exactly where a language without both a signed and an unsigned 32-bit type forces the author to choose the comparison explicitly, and a mid-range example like `lt_s(3, 4)` would pass either way while hiding the bug. With this in place you have the whole i32 core - constants, arithmetic, bit operations, and comparisons - so end the chapter by invoking a module whose body computes a small expression and check the returned value.
