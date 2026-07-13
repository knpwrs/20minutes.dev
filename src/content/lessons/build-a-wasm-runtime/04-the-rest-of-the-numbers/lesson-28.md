---
project: build-a-wasm-runtime
lesson: 28
title: Parameters and local.get
overview: 'A function receives its arguments as locals and reads them with local.get. Today you set up the call frame - the slots that hold a function''s parameters - and the instruction that reads them.'
goal: Invoke a function with arguments that fill its parameter locals, and execute local.get to read them.
spec:
  scenario: Reading function parameters
  status: failing
  lines:
    - kw: Given
      text: 'a function of type (param i32 i32)(result i32) whose body is 20 00 20 01 6A 0B'
    - kw: When
      text: it is invoked with the arguments 2 and 3
    - kw: Then
      text: 'local.get 0 pushes 2 and local.get 1 pushes 3, so the body computes 2 + 3 and returns 5'
    - kw: And
      text: 'the arguments fill the locals in order: local index 0 is the first parameter, index 1 the second'
code:
  lang: go
  source: |
    // A frame holds the current function's locals. On invoke, copy the arguments
    // into locals 0..n-1 (in order). local.get (0x20) pushes locals[index].
    type Frame struct{ Locals []Value }
    case 0x20: // local.get
      idx := readVarU32(body, &pc)
      stack.Push(frame.Locals[idx])
checkpoint: The engine can pass arguments to a function and read them as locals. Commit and stop here.
---

Until now `Invoke` ran a body with no inputs. Real functions take **parameters**, and WebAssembly delivers them as the first **locals** of the function's call **frame**: a function of type `(param i32 i32)` starts with its two arguments sitting in local slots `0` and `1`. So invoking with arguments `2` and `3` fills `locals[0] = 2` and `locals[1] = 3` before the first instruction runs, in the order the arguments are given.

`local.get` (`0x20`) is how the body reads them: it takes a local index as its immediate and pushes that slot's value onto the stack. The body `20 00 20 01 6A 0B` reads local `0`, reads local `1`, adds them, and ends - a real `add(a, b)` function returning `5`. This frame is also the thing calls will stack up on each other two chapters from now, and the slots that declared locals extend in the next lesson. Building the frame as a per-invocation array of locals, seeded from the arguments, is the foundation the rest of function execution rests on.
