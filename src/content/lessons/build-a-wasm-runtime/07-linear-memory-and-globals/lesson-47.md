---
project: build-a-wasm-runtime
lesson: 47
title: Running a compiled module
overview: 'Everything comes together today. You take the raw bytes of a real compiled module, decode it, instantiate it, and invoke its exported factorial - the whole runtime, working end to end.'
goal: Instantiate a compiled module from raw bytes and invoke its exported iterative factorial function.
spec:
  scenario: Running an exported factorial from raw bytes
  status: failing
  lines:
    - kw: Given
      text: 'the bytes of a compiled module exporting an iterative factorial "fact" of type (param i32)(result i32)'
    - kw: When
      text: '"fact" is invoked with different arguments'
    - kw: Then
      text: 'fact(0) = 1, fact(5) = 120, and fact(10) = 3628800'
    - kw: And
      text: 'the whole pipeline runs: decode the sections, instantiate (globals, table, memory), find the export, run the loop, and return the result - no new engine feature is needed'
code:
  lang: text
  source: |
    # The complete module (hand-assembled). Decode and invoke "fact":
    00 61 73 6D 01 00 00 00
    01 06 01 60 01 7F 01 7F
    03 02 01 00
    07 08 01 04 66 61 63 74 00 00
    0A 27 01 25 01 01 7F 41 01 21 01 02 40 03 40 20 00 45 0D 01
    20 01 20 00 6C 21 01 20 00 41 01 6B 21 00 0C 00 0B 0B 20 01 0B
checkpoint: You have a working WebAssembly runtime that decodes and runs a real compiled module. Commit and stop here.
---

This is the payoff the whole project built toward, and like the recursion lesson it needs **no new engine feature** - only the glue that runs the pipeline end to end. Take the module's raw bytes, decode its sections with the chapter-one and chapter-two decoders, **instantiate** it (evaluate globals, apply element and data segments, allocate memory), look up the export `fact`, and invoke it with an argument. The exact same loop that ran `i32.const 42` back in chapter three now runs a real function's control flow, arithmetic, and locals, and hands back a number.

Trace what the `fact` body does and you will recognize every piece you built: it sets a local `acc` to `1`, then a `block` around a `loop` where `br_if` exits when `n` reaches zero (`i32.eqz`), the body multiplies `acc` by `n` and decrements `n`, and `br` jumps back to the loop's top - the exact block-versus-loop branching from chapter five, over the i32 arithmetic and locals from chapters three and four. So `fact(5)` walks `120` and `fact(0)` short-circuits to `1`. That a runtime assembled one lesson at a time can take bytes a compiler emitted and produce the right answer is the whole point: you have built a real, if teaching-grade, WebAssembly runtime. The finalize pass turns this into a command-line tool with the module embedded, completes the instruction families the lessons sampled, and writes down honestly what it does and does not yet do.
