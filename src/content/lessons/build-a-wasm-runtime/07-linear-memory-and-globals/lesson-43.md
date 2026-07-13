---
project: build-a-wasm-runtime
lesson: 43
title: i32.load and i32.store
overview: 'Loads and stores move values between the stack and linear memory. Today you add the i32 load and store, with their alignment and offset immediates and little-endian byte order.'
goal: Execute i32.store and i32.load, writing and reading four little-endian bytes at an effective address.
spec:
  scenario: Storing and loading a 32-bit value
  status: failing
  lines:
    - kw: Given
      text: a one-page memory and the interpreter
    - kw: When
      text: 'i32.store writes 0x12345678 at address 0 and i32.load reads address 0 back'
    - kw: Then
      text: 'the load returns 0x12345678, and memory bytes 0..3 are 78 56 34 12 (little-endian, least significant byte first)'
    - kw: And
      text: 'each memory instruction carries an align and an offset immediate; the effective address is the popped address plus the offset, so storing at address 0 with offset 4 writes bytes 4..7'
code:
  lang: go
  source: |
    // Each has a memarg: align (varu32, a hint only) and offset (varu32).
    // Effective address = popped address + offset. i32 is 4 little-endian bytes.
    case 0x36: // i32.store
      align := readVarU32(body,&pc); off := readVarU32(body,&pc)
      v := stack.PopI32(); addr := stack.PopI32()
      putU32LE(mem, uint32(addr)+off, uint32(v))
    case 0x28: /* i32.load: read 4 LE bytes at addr+off, push as i32 */
checkpoint: The engine reads and writes 32-bit values in memory. Commit and stop here.
---

A load moves bytes from memory onto the stack; a store moves them the other way. `i32.store` (`0x36`) pops a value and an address and writes the value's four bytes to memory; `i32.load` (`0x28`) pops an address and pushes the four bytes it reads there. WebAssembly is **little-endian**, so `0x12345678` is stored least-significant byte first - bytes `78 56 34 12` - and read back the same way, which is the byte order to pin because a big-endian implementation would silently corrupt every multi-byte value.

Both instructions carry a **memarg**: two immediates, `align` and `offset`. The **offset** is a constant added to the popped address to form the **effective address**, so a compiler can encode `base + 4` as an address on the stack plus an offset immediate of `4` - handy for struct fields. The **align** is only a performance hint about expected alignment; it never changes the result, so you read it and ignore it. Watch the store operand order: the address is pushed before the value, so you pop the value first, then the address. Note that today's examples stay inside the memory; guarding the effective address against running off the end is the very next lesson.
