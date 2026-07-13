---
project: build-a-wasm-runtime
lesson: 8
title: The type section
overview: 'A module declares every function signature it uses up front, in the type section. Today you decode a function type - its parameters and results - and read the whole type section as a vector of them.'
goal: Decode the type section into a list of function types, each with its parameter and result value types.
spec:
  scenario: Decoding function types from the type section
  status: failing
  lines:
    - kw: Given
      text: 'a type section whose payload is 01 60 02 7F 7F 01 7F (one function type)'
    - kw: When
      text: the type section is decoded
    - kw: Then
      text: 'the result is one function type with parameters [i32, i32] and results [i32]'
    - kw: And
      text: 'a function type not beginning with the 0x60 tag byte is rejected with an error'
code:
  lang: go
  source: |
    // A functype is: 0x60, then a vec of param valtypes, then a vec of result
    // valtypes. The type section is just a vec of functypes - reuse readVec.
    type FuncType struct{ Params, Results []ValType }
    func readFuncType(c *Cursor) (FuncType, error) {
      // read 0x60, then params = readVec(readValType), then results = readVec(...)
    }
checkpoint: You can decode a module's function-type table. Commit and stop here.
---

The **type section** (id `1`) is a module's table of function **signatures**. Rather than repeat a signature everywhere it is used, a module lists each distinct one once here, and later sections refer to them by index. Every function type is introduced by the tag byte `0x60`, followed by a vector of parameter value types and then a vector of result value types - so `60 02 7F 7F 01 7F` reads as "a function taking two `i32` and returning one `i32`".

Notice how the pieces you already built click together: the section frame from the last chapter hands you the payload, `readVec` reads the two vectors, and `readValType` reads each element. This is the pattern for the rest of the module - each section is a vector of records, and each record is a short sequence of the primitives you have already written. The MVP allows at most one result, but decoding a full result vector now costs nothing and keeps you honest to the format.
