---
project: build-a-wasm-runtime
lesson: 39
title: The element section
overview: 'A table starts empty; the element section fills it. Today you decode an element segment and write its function indices into the table at load time.'
goal: Decode an element segment and initialize the table's slots with the function indices it lists.
spec:
  scenario: Initializing table slots
  status: failing
  lines:
    - kw: Given
      text: 'an element section whose payload is 01 00 41 00 0B 02 00 01 (one segment)'
    - kw: When
      text: the element section is decoded and applied
    - kw: Then
      text: 'the offset expression i32.const 0 gives a start index of 0, and the slots become table[0] = function 0 and table[1] = function 1'
    - kw: And
      text: 'the offset is an expression ending in end (0x0B): 41 00 0B is i32.const 0 followed by end'
code:
  lang: go
  source: |
    // A segment (MVP form 0): flag 0x00, an offset const-expr (ends in 0x0B),
    // then a vec of funcidx. Evaluate the offset, write funcidx into the table.
    func applyElement(c *Cursor, t *Table) error {
      // read flag; start := evalConstExpr()  // i32.const N ... 0x0B
      // funcs := readVec(readVarU32); copy into t.Funcs[start:]
    }
checkpoint: Your table is populated with real function references. Commit and stop here.
---

The **element section** (id `9`) supplies a table's initial contents. Each **element segment** names where to start writing and which functions to write: an **offset**, given as a small constant **expression** that ends in `end` (`0x0B`) - here `41 00 0B` is just `i32.const 0` - and then a **vector of function indices**. Applying the segment evaluates the offset to a start index and copies the function indices into the table starting there, so `02 00 01` fills `table[0] = function 0` and `table[1] = function 1`.

The offset being an *expression* rather than a bare number is a small but real detail: WebAssembly allows a constant expression there (in full generality it can read an imported global), and you evaluate it the same way you evaluate any constant-producing sequence - run it until `end` and take the value it leaves. For the MVP an `i32.const` is all you will see. Applying element segments is a **load-time** step, done once when the module is instantiated, before any exported function runs - so by the time a call happens, the table already points at real functions. With the table filled, indirect calls can finally dispatch.
