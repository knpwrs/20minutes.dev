---
project: build-a-memory-allocator
lesson: 28
title: The heap checker
overview: An allocator that silently corrupts its own structures is worse than one that crashes. Today you build a heap checker that walks every block and verifies the invariants the allocator promises - so a bug is caught, not hidden.
goal: Verify the heap's invariants, returning an error for the first violation and nil for a healthy heap.
spec:
  scenario: The checker passes a healthy heap and catches corruption
  status: failing
  lines:
    - kw: Given
      text: 'a healthy allocator (fresh, or after ordinary Malloc and Free calls)'
    - kw: When
      text: 'Check is called'
    - kw: Then
      text: 'it returns nil (no violation)'
    - kw: And
      text: 'on a heap deliberately corrupted with two adjacent free blocks (written directly, bypassing coalescing) Check returns a non-nil error'
code:
  lang: go
  source: |
    func (a *Allocator) Check() error {
      off := 0
      var prevFree bool
      for off < len(a.buf) {
        size, alloc := a.blockAt(off)
        if size < minBlock || size%8 != 0 { return fmt.Errorf("bad size %d at %d", size, off) }
        if u64(a.buf, off) != u64(a.buf, off+size-8) { return fmt.Errorf("header/footer mismatch at %d", off) }
        if !alloc && prevFree { return fmt.Errorf("adjacent free blocks at %d", off) }
        // also: a free block must appear in bins[classOf(size)]
        prevFree = !alloc
        off += size
      }
      if off != len(a.buf) { return fmt.Errorf("blocks do not tile the heap") }
      return nil
    }
checkpoint: A heap checker verifies the allocator's invariants. Commit and stop here.
---

Every allocator has a **heap checker** - CS:APP calls it the single most valuable
debugging tool you can write - because allocation bugs corrupt data structures that
are otherwise invisible. The checker walks the heap block by block and asserts the
invariants: sizes are legal multiples of 8 at or above the minimum, each block's
header matches its footer, no two free blocks are adjacent (coalescing keeps that
true), the blocks exactly tile the arena with none overlapping or leaking, and every
free block sits in the size-class bin for its size.

Return a descriptive error at the **first** violation and `nil` when everything
holds. A healthy allocator passes after any sequence of ordinary operations; a heap
you corrupt on purpose - here, two adjacent free blocks written directly, which
coalescing would never allow - is caught. From here, the last few lessons use the
checker as the backstop while the allocator learns to reject *misuse*: double frees
and bad offsets.
