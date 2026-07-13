---
project: build-a-wasm-runtime
lesson: 13
title: The value stack
overview: 'WebAssembly is a stack machine: instructions push and pop operands from one shared stack. Today you build that value stack, the surface every instruction in the rest of the project talks to.'
goal: Build a value stack that pushes and pops typed values and errors on underflow.
spec:
  scenario: Pushing and popping values
  status: failing
  lines:
    - kw: Given
      text: an empty value stack
    - kw: When
      text: 'the i32 values 1 and 2 are pushed, then popped twice'
    - kw: Then
      text: 'the first pop returns 2 and the second returns 1 (last in, first out)'
    - kw: And
      text: popping from an empty stack returns an error rather than reading past the bottom
code:
  lang: go
  source: |
    // A value carries its type and its bits. i32/i64/f32/f64 all fit in 64 bits,
    // so one slot holds any of them; i32 lives in the low 32 bits.
    type Value struct { Type ValType; Bits uint64 }
    // name the constructor so it doesn't clash with the I32 value-type constant
    func I32Val(v int32) Value { return Value{Type: I32, Bits: uint64(uint32(v))} }
    type Stack struct{ vals []Value }
    func (s *Stack) Push(v Value)        { s.vals = append(s.vals, v) }
    func (s *Stack) Pop() (Value, error) { /* underflow-check, shrink, return top */ }
checkpoint: You have a value stack that never underflows silently. Commit and stop here.
---

A WebAssembly program has no named registers and, mostly, no operand fields. Instead it is a **stack machine**: `i32.const 2` pushes a value, `i32.add` pops the top two and pushes their sum. So before any instruction exists, the thing they all share has to: a **value stack** that grows and shrinks in strict last-in-first-out order. Everything the engine does is a sequence of pushes and pops against it.

Each slot is a **value** that carries both its type and its bits. All four value types fit in 64 bits, so a single slot can hold any of them - an `i32` simply occupies the low 32 bits - which means you will never refactor the stack when `i64` and the floats arrive; only new instructions will. The one rule to enforce now is that popping an empty stack is an error, not a crash: a malformed body that pops too much should surface as a clean trap, and centralizing that check in `Pop` gives every future instruction that safety for free.
