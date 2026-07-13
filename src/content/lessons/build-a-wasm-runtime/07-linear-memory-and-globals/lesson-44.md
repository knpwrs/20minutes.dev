---
project: build-a-wasm-runtime
lesson: 44
title: Narrow accesses and the bounds trap
overview: 'Memory can be read and written a byte or a halfword at a time, and every access must stay inside the memory or trap. Today you add the narrow loads and stores and the bounds check that guards them all.'
goal: Execute the 8- and 16-bit loads and stores with correct extension, and trap on any out-of-bounds access.
spec:
  scenario: Sub-width access and out-of-bounds trapping
  status: failing
  lines:
    - kw: Given
      text: a one-page memory (65536 bytes)
    - kw: When
      text: 'a narrow store then a narrow load run, and an access near the end of memory is attempted'
    - kw: Then
      text: 'store8 of 0xFF then load8_u gives 255, while load8_s of the same byte gives -1 (the high bit is sign-extended)'
    - kw: And
      text: 'the bounds check covers the whole access: an i32.load at address 65532 succeeds (bytes 65532..65535), but at address 65533 it traps, and load8 at 65536 traps'
code:
  lang: go
  source: |
    // Narrow loads extend to i32: _u zero-extends, _s sign-extends. Every access
    // must satisfy addr + accessBytes <= len(mem), or it traps.
    func checkBounds(addr uint32, n int) error {
      if int(addr)+n > len(mem) { return &Trap{"out of bounds memory access"} }
      return nil
    }
    // 0x2C load8_s, 0x2D load8_u, 0x2E load16_s, 0x2F load16_u, 0x3A store8, 0x3B store16
checkpoint: The engine does sub-width memory access and never reads or writes out of bounds. Commit and stop here.
---

Memory is not only touched a full `i32` at a time. `store8` and `store16` write just the low **byte** or **halfword** of a value, and the narrow loads read one back - which is how a runtime handles bytes, chars, and packed 16-bit data. The narrow loads come in two flavors that split by sign, the same fork you have seen throughout: `load8_u` **zero-extends** the byte into an `i32`, so `0xFF` becomes `255`, while `load8_s` **sign-extends** it, so the same `0xFF` becomes `-1`. Choosing the wrong one turns every signed byte into a large positive number.

The second half of the lesson is the **bounds trap**, and it applies to every memory access, wide or narrow. The effective address plus the access width must fit entirely within the current memory; otherwise the access **traps** rather than reading a neighboring process's bytes or crashing. The boundary is exact and worth pinning: in a 65536-byte memory an `i32.load` (4 bytes) at address `65532` just fits (it touches `65532` through `65535`), but at `65533` it would need byte `65536`, which does not exist, so it traps - and a single-byte `load8` at `65536` is already past the end. This check is the guarantee that makes WebAssembly memory-safe, so it belongs on every load and store you have or will add.
