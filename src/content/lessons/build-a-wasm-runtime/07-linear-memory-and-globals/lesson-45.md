---
project: build-a-wasm-runtime
lesson: 45
title: The global section
overview: 'Globals are a module''s mutable state that outlives any single call. Today you decode the global section, evaluate each global''s initializer, and add global.get and global.set.'
goal: Decode globals with their types and initial values, and execute global.get and global.set.
spec:
  scenario: Reading and writing a global
  status: failing
  lines:
    - kw: Given
      text: 'a global section whose payload is 01 7F 01 41 0A 0B (one mutable i32 global initialized to 10)'
    - kw: When
      text: 'global.get and global.set run'
    - kw: Then
      text: 'global.get 0 first pushes 10, then global.set 0 stores 20, and a later global.get 0 pushes 20'
    - kw: And
      text: 'a global carries a mutability flag: 0x01 is mutable, 0x00 is immutable and may only be set by its initializer, never by global.set'
code:
  lang: go
  source: |
    // A global is: valtype, a mutability byte (0x00 const, 0x01 var), then an
    // init const-expr ending in 0x0B. global.get 0x23 reads; global.set 0x24 writes.
    type Global struct { Type ValType; Mutable bool; Val Value }
    case 0x23: idx := readVarU32(body,&pc); stack.Push(globals[idx].Val)
    case 0x24: idx := readVarU32(body,&pc); globals[idx].Val = stack.Pop()
checkpoint: The engine has module-level mutable state through globals. Commit and stop here.
---

A **global** is a single named value that lives for the life of the module instance, not just one call - a module's version of a top-level variable. The global section (id `6`) declares each one as a value type, a **mutability** flag, and an **initializer**: a constant expression ending in `end` (`0x0B`), exactly like the element and data offsets. So `7F 01 41 0A 0B` is "a mutable `i32` initialized to `10`" - you evaluate the init expression once at instantiation and store the result.

The two instructions are the obvious pair: `global.get` (`0x23`) pushes a global's current value, `global.set` (`0x24`) pops and stores one. The mutability flag is the rule to respect: a `0x01` **var** global can be reassigned by `global.set`, but a `0x00` **const** global is fixed after its initializer runs and `global.set` on it is invalid. Globals give a module a place to keep state between calls - a counter, a stack pointer, a configuration value - which is the last capability the engine needs before it can run realistic compiled modules end to end. With globals done, everything the capstone requires is in place.
