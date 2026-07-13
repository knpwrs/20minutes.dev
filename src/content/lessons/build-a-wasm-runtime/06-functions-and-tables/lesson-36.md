---
project: build-a-wasm-runtime
lesson: 36
title: Calling a function
overview: 'A program is more than one function; today you let one function call another. The call instruction sets up a fresh frame for the callee, runs it, and brings its results back.'
goal: Execute call, passing arguments from the stack into a new frame and returning the callee's results.
spec:
  scenario: One function calling another
  status: failing
  lines:
    - kw: Given
      text: 'a function g of type (param i32 i32)(result i32) that adds its two arguments, and a function f that pushes 2 and 3 and does call g'
    - kw: When
      text: f is invoked
    - kw: Then
      text: 'call pops g''s two arguments from the stack into g''s frame, runs g, and pushes its result, so f returns 5'
    - kw: And
      text: 'the arguments are taken in order: the deeper stack value becomes parameter 0, the top becomes parameter 1'
code:
  lang: go
  source: |
    // call (0x10) reads a funcidx. Pop the callee's params off the caller's
    // stack (in order), build a frame, run the body, push the results back.
    case 0x10: // call
      idx := readVarU32(body, &pc)
      ft := m.Types[m.FuncType[idx]]
      args := stack.PopN(len(ft.Params))       // deepest -> param 0
      results := m.call(idx, args)             // a new frame runs the callee
      stack.PushAll(results)
checkpoint: The engine can call one function from another. Commit and stop here.
---

So far a function has run in isolation. `call` (`0x10`) lets one function invoke another by index: it names a `funcidx`, pops that function's parameters off the **caller's** stack, builds a **new frame** for the callee with those arguments as its first locals, runs the callee's body, and pushes whatever the callee returns back onto the caller's stack. The argument order matches the earlier parameter rule - the values come off the stack so that the deepest becomes parameter `0` - so `f` pushing `2` then `3` and calling `g(a, b) = a + b` returns `5`.

The important design point is that each call gets its **own** frame: its own locals, independent of the caller's. Your `Invoke` from chapter three already ran one function on a fresh frame; `call` generalizes that to happen mid-execution, from inside another function's body. This is the seed of the **call stack** - frames nested inside frames - which the next lesson leans on to make recursion work without a single new opcode. Keep the caller's stack and the callee's frame cleanly separate, and calls compose to any depth.
