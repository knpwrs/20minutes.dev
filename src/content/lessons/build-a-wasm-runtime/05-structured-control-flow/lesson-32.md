---
project: build-a-wasm-runtime
lesson: 32
title: Conditional branching with br_if
overview: 'A loop needs to branch only when a condition holds. Today you add br_if, the conditional branch that pops an i32 and branches only when it is nonzero.'
goal: Execute br_if, which branches to a label when the popped condition is nonzero and falls through when it is zero.
spec:
  scenario: Branching on a condition
  status: failing
  lines:
    - kw: Given
      text: the interpreter running a body that contains a block
    - kw: When
      text: 'br_if 0 executes with a condition on the stack'
    - kw: Then
      text: '02 40 41 00 0D 00 41 09 0B 0B (block, i32.const 0, br_if 0, i32.const 9, end, end) does not branch, so 9 is pushed and the result is 9'
    - kw: And
      text: 'with a nonzero condition - 02 40 41 01 0D 00 41 09 0B 0B - br_if branches out and 9 is skipped, leaving the stack empty'
code:
  lang: go
  source: |
    // br_if (0x0D) pops an i32 condition. Nonzero -> branch (same as br);
    // zero -> fall through to the next instruction.
    case 0x0D: // br_if
      depth := readVarU32(body, &pc)
      if stack.PopI32() != 0 {
        // branch exactly like br
      }
      // otherwise continue
checkpoint: The engine can branch conditionally with br_if. Commit and stop here.
---

`br` always branches; `br_if` (`0x0D`) branches **only if** a condition is true. It pops an `i32` from the stack and, if that value is **nonzero**, branches to the named label exactly as `br` would; if the value is **zero**, it does nothing and execution falls through to the next instruction. It uses the same 0-or-1 booleans your comparison instructions produce, so `i32.eqz` followed by `br_if` reads naturally as "branch if this was zero".

This is the piece that makes loops terminate. An unconditional `br` back to the top of a loop would spin forever; a `br_if` that exits the loop when a counter hits its limit is what ends it. So the two cases to pin are exactly the two directions: with condition `0`, `br_if` falls through and the following `i32.const 9` runs (result `9`); with a nonzero condition, it branches out of the block and the `9` is skipped. With conditional branching in hand, the next lesson can finally build a loop that runs a bounded number of times.
