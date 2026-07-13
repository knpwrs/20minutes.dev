---
project: build-a-wasm-runtime
lesson: 7
title: Value types
overview: 'Everything WebAssembly computes with has one of four number types: i32, i64, f32, f64. Today you decode the single byte that names a value type, the vocabulary every function signature and local declaration is written in.'
goal: Decode a value type from one byte into one of the four WebAssembly number types, rejecting any other byte.
spec:
  scenario: Reading a value type tag
  status: failing
  lines:
    - kw: Given
      text: a cursor positioned at a value-type byte
    - kw: When
      text: the value type is decoded
    - kw: Then
      text: '0x7F decodes to i32, 0x7E to i64, 0x7D to f32, and 0x7C to f64'
    - kw: And
      text: any other byte, such as 0x00, is rejected with an error
code:
  lang: go
  source: |
    // The four MVP value types are a single byte each, counting DOWN from 0x7F.
    type ValType byte
    const (
      I32 ValType = 0x7F
      I64 ValType = 0x7E
      F32 ValType = 0x7D
      F64 ValType = 0x7C
    )
    func (c *Cursor) readValType() (ValType, error) { /* read one byte, validate */ }
checkpoint: You can decode the four value types that name every number in a module. Commit and stop here.
---

WebAssembly's MVP has exactly four **value types**, the only kinds of value a program can push, pop, store, or pass: 32- and 64-bit integers (`i32`, `i64`) and 32- and 64-bit IEEE-754 floats (`f32`, `f64`). Every function signature, every local, every global is spelled out as a sequence of these. In the binary format each is a single byte, and they are numbered downward from `0x7F`: `i32` is `0x7F`, `i64` is `0x7E`, `f32` is `0x7D`, `f64` is `0x7C`.

This is a tiny decoder, but it is the alphabet the next few lessons spell words with. A function type is a list of value types in and a list out; a local declaration is a value type and a count. Rejecting an unknown byte here matters because a bad type tag is the first sign a module is malformed or uses a feature past the MVP, and it is far better to fail cleanly at decode time than to carry a nonsense type into the engine.
