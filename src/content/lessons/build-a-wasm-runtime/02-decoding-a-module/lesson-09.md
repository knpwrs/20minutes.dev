---
project: build-a-wasm-runtime
lesson: 9
title: The function section
overview: 'The function section says how many functions the module defines and which type each one has. Today you decode that list of type indices, the link between a function and its signature.'
goal: Decode the function section into a list of type indices, one per defined function.
spec:
  scenario: Mapping functions to their type indices
  status: failing
  lines:
    - kw: Given
      text: 'a function section whose payload is 02 00 00 (a count of 2, then two type indices)'
    - kw: When
      text: the function section is decoded
    - kw: Then
      text: 'the result is [0, 0] - two functions, each declared to have type index 0'
    - kw: And
      text: an empty function section (count 0) decodes to an empty list
code:
  lang: go
  source: |
    // The function section is a vec of u32 type indices. Function k's signature
    // is Types[funcTypeIdx[k]] - it does NOT carry the code, only the type link.
    func readFunctionSection(c *Cursor) ([]uint32, error) {
      return readVec(c, func(c *Cursor) (uint32, error) { return c.readVarU32() })
    }
checkpoint: You know each function's signature by index. Commit and stop here.
---

WebAssembly splits a function's declaration across two sections, and the **function section** (id `3`) holds the lighter half: for each function the module defines, a single **type index** pointing into the type table you just decoded. Its payload is simply a vector of `u32` indices, so `02 00 00` means "two functions, both of type `0`". The function's actual body - its locals and instructions - lives separately in the code section, and the two are matched up by position: the k-th type index goes with the k-th code entry.

Why the split? It lets a decoder learn every function's signature before reading a single instruction, which is exactly what validation and call-checking need. For now you only need the list of indices; pairing them with signatures and bodies comes when you assemble the whole module. Keep this decoder trivial - it is one call to `readVec` over `readVarU32`.
