---
project: build-a-wasm-runtime
lesson: 38
title: The table section
overview: 'A table is an array of function references, the substrate for indirect calls. Today you decode the table section and allocate the table''s slots.'
goal: Decode the table section into a table of the declared size, with funcref slots.
spec:
  scenario: Decoding a table declaration
  status: failing
  lines:
    - kw: Given
      text: 'a table section whose payload is 01 70 00 02 (one table)'
    - kw: When
      text: the table section is decoded
    - kw: Then
      text: 'it declares one table of element type funcref (0x70) with a minimum of 2 slots'
    - kw: And
      text: 'the limits byte selects the form: 0x00 is min only, 0x01 is min then max; the slots start empty (no function assigned)'
code:
  lang: go
  source: |
    // A table is: elemtype (0x70 = funcref), then limits. Limits are a flag byte
    // (0x00 min-only, 0x01 min+max) followed by the min (and max if present).
    type Table struct { Funcs []int } // -1 (or a null marker) means empty slot
    func readTable(c *Cursor) (Table, error) {
      // read 0x70; read limits; allocate min slots, all empty
    }
checkpoint: You can decode a module's table and allocate its slots. Commit and stop here.
---

A **table** (section id `4`) is an array whose elements are **function references** - in the MVP, the only element type is `funcref` (`0x70`). Its purpose is **indirect** calls: where `call` names a fixed function at decode time, a table lets a program pick a function at run time by index, which is how compilers implement function pointers, virtual method dispatch, and `switch`-over-callbacks. Today you just decode the declaration and allocate the slots; filling and calling through them are the next lessons.

The declaration is an element type followed by **limits**, the same min/max shape a memory uses (you will meet it again in chapter seven). A flag byte chooses the form: `0x00` means a minimum only, `0x01` means a minimum then a maximum. So `70 00 02` is "a funcref table with at least 2 slots, no maximum". Allocate the table at its minimum size with every slot **empty** - no function assigned yet - and mark empties clearly, because calling through an unfilled slot is a trap you will implement two lessons from now. The element section fills these slots next.
