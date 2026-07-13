---
project: build-a-wasm-runtime
lesson: 29
title: Declared locals, local.set and local.tee
overview: 'Beyond its parameters, a function can declare working locals, and it writes them with local.set and local.tee. Today you initialize the declared locals and add the two instructions that assign to them.'
goal: Initialize declared locals to zero and execute local.set and local.tee.
spec:
  scenario: Writing to locals
  status: failing
  lines:
    - kw: Given
      text: 'a function whose declared locals follow its parameters, each starting at 0'
    - kw: When
      text: 'local.set and local.tee execute'
    - kw: Then
      text: 'local.set pops a value and stores it, so setting local 0 to 7 then local.get 0 pushes 7'
    - kw: And
      text: 'local.tee pops, stores, and pushes the value back, so tee 7 into a local leaves 7 on the stack and stored in the local'
code:
  lang: go
  source: |
    // Declared locals (from the code section) follow the parameters and start at
    // zero. set (0x21) pops and stores; tee (0x22) stores but keeps a copy.
    case 0x21: // local.set
      idx := readVarU32(body, &pc); frame.Locals[idx] = stack.Pop()
    case 0x22: // local.tee
      idx := readVarU32(body, &pc); v := stack.Peek(); frame.Locals[idx] = v
checkpoint: The engine can declare, read, and write local variables. Commit and stop here.
---

Parameters are only the first locals; a function also declares its own **working locals** in the code section - the run-length list you decoded back in lesson 11. Those slots come right after the parameters in the same index space, and WebAssembly guarantees they start at **zero**. So when you build the frame, seed it with the arguments, then append one zero-initialized slot per declared local. Now `local.get n` can read any of them.

Writing is two instructions that differ by one detail. `local.set` (`0x21`) pops the top of the stack and stores it into the local - a plain assignment. `local.tee` (`0x22`) does the same store but **leaves a copy on the stack**, so the value is both saved and still available to the next instruction. That copy-and-keep is exactly what you want for the update-and-test idiom a loop uses - `local.tee` a counter, then immediately compare it - which is why real loops lean on `tee`. With locals readable and writable, the engine has everything the control-flow chapter needs to build actual loops.
