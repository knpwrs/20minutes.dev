---
project: build-a-wasm-runtime
lesson: 42
title: Linear memory, size and grow
overview: 'A module''s memory is one big byte array measured in 64 KiB pages. Today you decode the memory section, allocate that array, and add the two instructions that report and change its size.'
goal: Decode the memory section, allocate the memory, and execute memory.size and memory.grow.
spec:
  scenario: Allocating and growing linear memory
  status: failing
  lines:
    - kw: Given
      text: 'a memory section whose payload is 01 00 01 (one memory, minimum 1 page)'
    - kw: When
      text: 'the memory is allocated and memory.size then memory.grow run'
    - kw: Then
      text: 'the memory is 1 page (65536 bytes) and memory.size pushes 1'
    - kw: And
      text: 'memory.grow of 1 page pushes the old size 1 and grows the memory to 2 pages; a grow that would exceed the maximum pushes -1 and leaves memory unchanged'
code:
  lang: go
  source: |
    // A memory is limits (like a table's), sized in 64 KiB pages. memory.size
    // (0x3F 0x00) pushes the page count; memory.grow (0x40 0x00) pops a delta,
    // pushes the OLD size (or -1 on failure), and appends zeroed pages.
    const PageSize = 65536
    case 0x3F: pc++; stack.Push(I32(int32(len(mem) / PageSize)))
    case 0x40: pc++; /* delta := pop; old := pages; grow or push -1 */
checkpoint: The engine allocates linear memory and can size and grow it. Commit and stop here.
---

**Linear memory** is a WebAssembly module's heap: a single contiguous, byte-addressable array that starts at zero and grows upward. The memory section (id `5`) declares it with the same **limits** shape a table uses - a minimum and optional maximum - but counted in **pages** of exactly 64 KiB (`65536` bytes). So `01 00 01` declares one memory with a minimum of 1 page, and you allocate a `65536`-byte array, all zeros, to back it.

Two instructions inspect and resize it. `memory.size` (`0x3F 0x00`) pushes the current size in **pages**, not bytes - `1` for a one-page memory. `memory.grow` (`0x40 0x00`) pops a page **delta**, tries to append that many zero-filled pages, and pushes the **old** page count on success or **-1** on failure (for example, growing past the declared maximum), leaving memory untouched when it fails. Both carry a trailing `0x00` byte - a memory index, always zero in the MVP since there is one memory. Returning the old size rather than the new is the convention callers rely on to learn where the freshly grown region begins, and the zero-fill guarantee is what lets code read newly grown memory safely.
