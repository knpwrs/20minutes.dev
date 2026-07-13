---
project: build-a-wasm-runtime
lesson: 46
title: The data section
overview: 'The data section is to memory what the element section is to the table: it fills memory with initial bytes at load time. Today you decode a data segment and write its bytes into memory.'
goal: Decode a data segment and copy its bytes into linear memory at the segment's offset when the module is instantiated.
spec:
  scenario: Initializing memory from a data segment
  status: failing
  lines:
    - kw: Given
      text: 'a data section whose payload is 01 00 41 00 0B 02 48 69 (one segment)'
    - kw: When
      text: the data section is decoded and applied
    - kw: Then
      text: 'the offset expression i32.const 0 gives a start of 0, and the two bytes 48 69 ("Hi") are written to memory addresses 0 and 1'
    - kw: And
      text: 'a later load8_u of address 0 reads 72 (0x48), confirming the bytes landed in memory'
code:
  lang: go
  source: |
    // A data segment (MVP form 0): flag 0x00, an offset const-expr (ends 0x0B),
    // then a vec of raw bytes. Evaluate the offset, copy the bytes into memory.
    func applyData(c *Cursor, mem []byte) error {
      // read flag; start := evalConstExpr(); bytes := readVec(readByte)
      // copy(mem[start:], bytes)
    }
checkpoint: The engine can preload memory from data segments. Commit and stop here.
---

The **data section** (id `11`) initializes linear memory the same way the element section initializes the table. Each **data segment** names an **offset** - a constant expression ending in `end` - and then a **vector of raw bytes**, and applying it copies those bytes into memory starting at the offset. So `00 41 00 0B 02 48 69` writes the two bytes `48 69` (the ASCII for `"Hi"`) at addresses `0` and `1`, and a subsequent `load8_u` of address `0` reads `72`, confirming the bytes are really there.

This is how a compiled module ships its constant data - string literals, lookup tables, preinitialized arrays - baked into the binary and laid into memory before any code runs. Like element segments, data segments are applied at **instantiation**, in section order, as part of setting the module up rather than during execution. With this, every kind of initial state a module declares - globals, table entries, and now memory contents - is established before the first exported function is called, which is exactly the clean starting point the capstone needs to run a real compiled module from raw bytes.
