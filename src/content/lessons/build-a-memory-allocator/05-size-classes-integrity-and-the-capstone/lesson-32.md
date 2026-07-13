---
project: build-a-memory-allocator
lesson: 32
title: 'Capstone: a workload with no leaks'
overview: The finale runs a full allocate, write, free, calloc, realloc-free workload against the allocator and asserts the exact final heap - fully coalesced, uncorrupted, with nothing leaked. Every layer you built proves itself at once.
goal: Run a scripted workload and assert the exact final layout, a clean checker, and no leaks.
spec:
  scenario: A full workload ends in a clean, coalesced heap
  status: failing
  lines:
    - kw: Given
      text: 'a fresh 128-byte allocator and the script: a=Malloc(24); b=Malloc(8); c=Malloc(40); store 0x2A at b; Free(b); d=Calloc(8); Free(a); Free(d); Free(c)'
    - kw: When
      text: 'the script runs in order'
    - kw: Then
      text: 'a=8, b=48, c=72, and d reuses b at offset 48 with its payload zeroed (the byte at 48 is 0x00, not 0x2A)'
    - kw: And
      text: "after the final three frees the heap is fully coalesced - Dump is '0:128:F', Check returns nil, and Stats reports AllocBlocks 0 with FreeBytes 128 (no corruption, no overlap, no leak)"
code:
  lang: go
  source: |
    al := NewAllocator(128)
    a, _ := al.Malloc(24)  // 8
    b, _ := al.Malloc(8)   // 48
    c, _ := al.Malloc(40)  // 72
    al.Set(b, 0x2A)
    al.Free(b)
    d, _ := al.Calloc(8)   // 48 again, zeroed
    al.Free(a); al.Free(d); al.Free(c)
    // Dump()=="0:128:F"; Check()==nil; Stats().AllocBlocks==0
checkpoint: Your allocator runs a full workload and ends clean - no corruption, no leaks. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real **memory
allocator**. The script exercises every piece at once - `Malloc` carves three blocks
from the arena with splitting, a write proves the payload is usable, `Free` and
`Calloc` show a freed block reused and scrubbed clean, and the final three frees
walk the heap back through backward coalescing until it is one whole free block
again. The exact final `Dump` of `0:128:F` is only reachable if splitting,
coalescing, and binning all agree.

Then the two self-checks close the loop: `Check` confirms the blocks tile the arena
with matching tags and no adjacent free pairs, and `Stats` confirms every allocation
came back - `AllocBlocks` is 0 and all 128 bytes are free. From a bump allocator that
could only free everything at once, you have built the honest core of a real
allocator - boundary-tagged blocks, an explicit segregated free list, first-fit and
best-fit placement, realloc and calloc, coalescing, and a heap checker - the same
design that sits inside dlmalloc and the mallocs you use every day, minus the OS
integration and thread safety they layer on top. That is a real allocator, and it is
yours.
