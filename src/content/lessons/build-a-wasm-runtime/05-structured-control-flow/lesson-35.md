---
project: build-a-wasm-runtime
lesson: 35
title: br_table and branch arity
overview: 'br_table is WebAssembly''s jump table - the switch statement - selecting a branch target by an index. Today you add it, pin the default case, and pin that a branch carries the target block''s result values.'
goal: Execute br_table, branching to the target chosen by a popped index or to the default when the index is out of range.
spec:
  scenario: An indexed branch with a default
  status: failing
  lines:
    - kw: Given
      text: 'a switch function of type (param i32)(result i32) built from nested blocks and one br_table with targets [0] and default 1'
    - kw: When
      text: it is invoked with different index arguments
    - kw: Then
      text: 'index 0 branches to the first case and returns 10'
    - kw: And
      text: 'any other index takes the default case, so index 1 and index 5 both return 20, and each branch carries the one i32 result the target block declares'
code:
  lang: go
  source: |
    // The switch body (outer block blocktype 0x7F = result i32):
    // 02 7F 02 40 02 40 20 00 0E 01 00 01 0B 41 0A 0C 01 0B 41 14 0C 00 0B 0B
    // -- index 0 -> case 0 (push 10); any other -> default case (push 20).
    case 0x0E: // br_table
      n := readVarU32(body, &pc)
      targets := make([]uint32, n) // read n label depths, then the default depth
      i := stack.PopI32()
      // branch to targets[i] if 0 <= i < n, else to the default depth
checkpoint: The engine can do an indexed branch, completing structured control flow. Commit and stop here.
---

`br_table` (`0x0E`) is the indexed branch - a jump table. It carries a vector of **label depths** and one **default** depth, and it pops an `i32` index. If the index is in range (`0 <= index < count`), it branches to the label at `targets[index]`; otherwise it branches to the **default**. That out-of-range fallback is why an index can be any `i32` without a bounds trap: the default always catches it. The example uses one explicit target and a default (a case-and-fallthrough switch), but the same instruction scales to any number of targets: compilers lower a dense `switch` to exactly this, nesting one block per case so that branching to depth `k` lands at case `k`'s code.

This lesson also pins **branch arity**, the detail the whole chapter has been building toward. A branch does not just jump - it carries the target region's **result values** with it. The outer `block` here is typed `(result i32)`, so when a case pushes its constant and branches to that block, the branch keeps that one `i32` on the stack as the block's result; a branch to a void block would carry zero values. Getting arity right is what makes a branch out of a value-producing block leave exactly the right thing behind. With `br_table` done, structured control flow is complete: block, loop, if/else, br, br_if, and the jump table - enough to run any compiled function's control graph.
