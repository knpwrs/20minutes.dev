---
project: build-a-wasm-runtime
lesson: 37
title: The call stack and recursion
overview: 'Because every call gets its own frame, a function calling itself just works. Today you prove it: run a recursive function and watch the call stack do its job with no new engine code.'
goal: Run a recursive function and confirm the call stack nests frames correctly.
spec:
  scenario: Computing a value by recursion
  status: failing
  lines:
    - kw: Given
      text: 'a recursive Fibonacci function of type (param i32)(result i32): return n when n < 2, else fib(n-1) + fib(n-2)'
    - kw: When
      text: it is invoked with various arguments
    - kw: Then
      text: 'fib(0) = 0, fib(1) = 1, and fib(10) = 55'
    - kw: And
      text: 'no new opcode is needed - recursion works because each call already gets its own independent frame'
code:
  lang: go
  source: |
    // Nothing new to implement. A function calls itself with `call <its own idx>`;
    // each invocation gets a fresh frame, so the recursion nests naturally.
    // (fib body sketch: if n < 2 return n; else call fib(n-1), call fib(n-2), add)
checkpoint: The engine runs recursive functions. Commit and stop here.
---

This lesson writes no new engine code, and that is the point. Recursion is not a special feature of an interpreter - it falls out for free the moment every `call` gets its **own frame**. When `fib` calls `fib(n-1)`, the inner call runs on a fresh frame with its own copy of the parameter `n`, entirely separate from the caller's; when it returns, the caller's frame is exactly as it was. Stack the frames deep enough and you have computed `fib(10) = 55`, one nested call at a time. If it did not work, the bug would be in how `call` isolates frames - which is why running a recursive function is the cleanest possible test that the last lesson was correct.

This is a **payoff** lesson: the satisfying moment where machinery built for a plain reason (isolated frames for plain calls) turns out to give you something bigger for nothing. Pin the boundary cases `fib(0) = 0` and `fib(1) = 1` alongside `fib(10) = 55`, because the base case is where a recursion that never terminates would reveal itself. The one real limit is the host's own stack depth: very deep recursion can overflow it, which a production runtime guards with an explicit call-depth limit - a good caveat to remember for later.
