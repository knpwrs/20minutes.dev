---
project: build-a-memory-allocator
lesson: 24
title: A mixed workload
overview: Time to drive the whole allocator API through one scripted sequence - malloc, calloc, free - and check the exact heap that results. It is a dress rehearsal for the capstone and a demo you can run end to end.
goal: Run a fixed allocate-and-free script and assert the exact resulting layout.
spec:
  scenario: A scripted workload produces an exact layout
  status: failing
  lines:
    - kw: Given
      text: 'a fresh 96-byte allocator'
    - kw: When
      text: 'a = Malloc(8) then 0x99 is stored at a; b = Malloc(16); Free(a); c = Calloc(8) are run in order'
    - kw: Then
      text: 'a and c both equal offset 8 (c reuses the freed block), b equals offset 32'
    - kw: And
      text: "the byte at offset 8 is 0x00 (calloc zeroed the reused block) and Dump is '0:24:A|24:32:A|56:40:F'"
code:
  lang: go
  source: |
    a, _ := al.Malloc(8)   // 8  -> block (0,24)
    al.Set(a, 0x99)
    b, _ := al.Malloc(16)  // 32 -> block (24,32)
    al.Free(a)             // block 0 free again
    c, _ := al.Calloc(8)   // 8  -> reuses block 0, zeroed
    // Dump == "0:24:A|24:32:A|56:40:F"
checkpoint: The full allocator API runs end to end on a mixed workload. Commit and stop here.
---

This lesson writes no new allocator code - it **uses** what you have. A short script
allocates two blocks, stores a byte, frees the first, then calloc's a block of the
same size. Tracing it confirms the pieces cooperate: the freed block at offset 0 is
the one `calloc` reuses (so `a` and `c` share offset 8), the byte written under
`a`'s ownership is scrubbed back to zero by `calloc`, and the final layout is
exactly three blocks.

Running a whole workload and asserting one `Dump` string is how you gain confidence
that malloc, free, split, coalesce, and calloc all agree with each other - the same
shape of check the capstone will make at the very end, only larger. The core
allocator is done; the last chapter makes it faster with size-class bins and
adds the self-checks that prove a heap is not corrupt.
