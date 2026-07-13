---
project: build-a-wasm-runtime
lesson: 40
title: call_indirect
overview: 'call_indirect picks the function to call at run time, by index into the table. Today you add it, including the type check that makes indirect dispatch safe.'
goal: Execute call_indirect, looking up a function in the table by a popped index and calling it after checking its type.
spec:
  scenario: Calling a function through the table
  status: failing
  lines:
    - kw: Given
      text: 'a table filled with function 0 (an add-one function of type (param i32)(result i32)) at slot 0, and a caller that pushes 41 then the index 0'
    - kw: When
      text: 'call_indirect with the matching type index executes'
    - kw: Then
      text: 'it pops the index 0, reads function 0 from the table, confirms its type matches the expected type, calls it, and returns 42'
    - kw: And
      text: 'the expected type is named by the instruction''s type index; a call whose runtime function has a different type is a mismatch (handled next lesson)'
code:
  lang: go
  source: |
    // call_indirect (0x11): immediates are a typeidx and a tableidx (0x00 in MVP).
    // Pop an i32 slot index, fetch the funcidx from the table, check its type
    // equals Types[typeidx], then call it like a normal call.
    case 0x11:
      typeidx := readVarU32(body, &pc); _ = readVarU32(body, &pc) // tableidx
      slot := stack.PopI32()
      fidx := table.Funcs[slot]
      // require m.Types[m.FuncType[fidx]] == m.Types[typeidx]; then call fidx
checkpoint: The engine can dispatch calls through the table. Commit and stop here.
---

`call_indirect` (`0x11`) is the run-time call: instead of naming a function, it names an **expected type** and pops an **index** into the table, then calls whatever function is sitting in that slot. Its immediates are a `typeidx` (the signature the call site expects) and a `tableidx` (always `0x00` in the MVP, since there is one table). So a caller pushes the real argument, pushes the slot index, and `call_indirect` fetches `table[index]`, arrives at a function index, and calls it exactly like a direct `call` - returning `42` when slot `0` holds an add-one function fed `41`.

The reason for the `typeidx` immediate is **safety**. The engine cannot trust that the slot holds a function of the right shape - the table is just data, and the index came off the stack - so before calling it verifies that the target function's actual type **matches** the expected type. This run-time type check is what makes indirect dispatch sound: it guarantees the callee reads exactly the arguments the caller pushed. Today you implement the happy path where the types match; the next lesson turns the mismatch, the out-of-range index, and the empty slot into clean traps.
