---
project: build-a-memory-allocator
lesson: 31
title: Fragmentation and usage stats
overview: To reason about an allocator you need to see its state as numbers - how much is in use, how much is free, and how scattered the free space is. Today you add a stats report that also reveals leaks and fragmentation.
goal: Report allocated and free block counts, byte totals, and the largest free block.
spec:
  scenario: Stats summarize the heap
  status: failing
  lines:
    - kw: Given
      text: 'a 64-byte heap where Malloc(16) produced (0, 32, allocated) and (32, 32, free)'
    - kw: When
      text: 'Stats is called'
    - kw: Then
      text: 'it reports AllocBlocks 1, AllocBytes 32, FreeBlocks 1, FreeBytes 32, LargestFree 32'
    - kw: And
      text: 'a fresh 64-byte heap reports AllocBlocks 0, FreeBytes 64, LargestFree 64'
code:
  lang: go
  source: |
    type Stats struct { AllocBlocks, AllocBytes, FreeBlocks, FreeBytes, LargestFree int }
    func (a *Allocator) Stats() Stats {
      var s Stats
      for _, b := range a.Blocks() {
        if b.Alloc { s.AllocBlocks++; s.AllocBytes += b.Size } else {
          s.FreeBlocks++; s.FreeBytes += b.Size
          if b.Size > s.LargestFree { s.LargestFree = b.Size }
        }
      }
      return s
    }
checkpoint: The allocator reports usage and fragmentation stats. Commit and stop here.
---

Numbers make an allocator legible. **Stats** walks the heap once and totals it up:
how many blocks are allocated and how many bytes they hold, how many free blocks
there are and their total bytes, and the size of the **largest** free block. That
last figure is the key fragmentation signal - when free bytes are plentiful but the
largest free block is small, memory is fragmented and a large request will fail
despite the free total.

These numbers are also how you spot a **leak**: if every allocation has been freed,
`AllocBlocks` should be 0 and the free bytes should equal the whole heap. That is
exactly the check the capstone makes after running a full workload and freeing
everything - allocated count back to zero, one free block spanning the arena, and
the checker clean. One lesson to go.
