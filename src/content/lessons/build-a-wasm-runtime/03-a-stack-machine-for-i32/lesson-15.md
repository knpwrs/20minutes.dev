---
project: build-a-wasm-runtime
lesson: 15
title: i32.const
overview: 'The first instruction that produces a value is i32.const, which pushes a literal onto the stack. Today you decode its signed operand and push it, giving the engine something to compute with.'
goal: Execute i32.const by decoding its signed LEB128 operand and pushing it onto the value stack.
spec:
  scenario: Pushing a constant
  status: failing
  lines:
    - kw: Given
      text: the interpreter running a body
    - kw: When
      text: 'the body 41 2A 0B (i32.const 42, end) is executed'
    - kw: Then
      text: the stack finishes with the single i32 value 42
    - kw: And
      text: '41 7F 0B (i32.const with the signed LEB128 byte 0x7F) pushes -1, not 127'
code:
  lang: go
  source: |
    // i32.const (0x41) is followed by a signed LEB128 immediate. Reuse the signed
    // varint decoder from chapter one - it already handles the sign extension.
    case 0x41:
      v, err := readVarS32(body, &pc) // advances pc past the immediate
      if err != nil { return err }
      stack.Push(I32(v))
checkpoint: The engine can push i32 literals from a body. Commit and stop here.
---

`i32.const` (opcode `0x41`) is the simplest value-producing instruction: it carries an immediate operand and pushes it. That operand is a **signed LEB128** integer - the exact decoder you wrote back in chapter one - so `41 2A` pushes `42`, and the engine advances past however many bytes the immediate used. Most real function bodies are dense with constants, so this is the instruction that gives every later arithmetic and comparison op its raw material.

The signedness is the thing to keep honest, and it is why the second case matters: `41 7F` is not `i32.const 127`. The byte `0x7F` as a signed LEB128 value is `-1`, because its sign bit is set - the same boundary you pinned when you built the signed decoder. Feeding constants through the *signed* varint reader, not the unsigned one, is what makes `i32.const -1` come out as `-1`. Getting this wrong turns every negative literal into a large positive number and quietly breaks arithmetic downstream.
