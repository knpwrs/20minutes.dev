---
project: build-a-wasm-runtime
lesson: 34
title: if and else
overview: 'if and else are the structured conditional: run one branch or the other based on a popped value. Today you add them, built on the same label machinery as block.'
goal: Execute if and else, running the then-branch when the condition is nonzero and the else-branch when it is zero.
spec:
  scenario: Choosing a branch by condition
  status: failing
  lines:
    - kw: Given
      text: the interpreter running a body that contains an if
    - kw: When
      text: 'if pops its condition and runs the matching branch'
    - kw: Then
      text: '41 01 04 7F 41 2A 05 41 07 0B 0B (i32.const 1, if result i32, i32.const 42, else, i32.const 7, end) runs the then-branch and leaves 42'
    - kw: And
      text: 'with a zero condition - 41 00 04 7F 41 2A 05 41 07 0B 0B - the else-branch runs instead and the result is 7'
code:
  lang: go
  source: |
    // if (0x04) pops an i32 and pushes a label like block. Nonzero -> run the
    // then-branch; zero -> skip to just after else (0x05). end (0x0B) closes it.
    case 0x04: // if
      bt := readBlockType(body, &pc)
      labels = append(labels, Label{Arity: bt.results, Target: matchingEnd(body, pc)})
      if stack.PopI32() == 0 { pc = elseOrEnd(body, pc) } // jump to else/end
    case 0x05: // else: reached only by falling out of the then-branch; skip to end
      pc = matchingEnd(...)
checkpoint: The engine can choose between two branches with if and else. Commit and stop here.
---

`if` (`0x04`) is the structured conditional, and it reuses everything you built for `block`. It carries a blocktype and pushes a label whose target is just past the matching `end`, so a branch can escape it like any other region. What is new is that `if` **pops an `i32` condition** the moment it runs: if the value is **nonzero**, execution enters the **then-branch**; if it is **zero**, execution jumps forward to the `else` branch (`0x05`), or to the `end` if there is no `else`.

The `else` opcode marks the boundary between the two branches. When the then-branch runs and reaches `else` by falling through, it must **skip** the else-branch and continue at the `end` - you do not run both halves. So `i32.const 1` then `if ... else ... end` takes the then-branch and yields `42`, while `i32.const 0` takes the else-branch and yields `7`. If the blocktype declares a result, both branches must leave one value, which is how `if/else` doubles as an expression that produces a value. With `if` in place, the engine has the full structured-control vocabulary except the multi-way branch.
