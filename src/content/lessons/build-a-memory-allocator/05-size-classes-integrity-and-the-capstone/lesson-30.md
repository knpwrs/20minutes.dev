---
project: build-a-memory-allocator
lesson: 30
title: Rejecting bad offsets
overview: A caller can pass Free an offset that is misaligned, out of range, or simply not the start of a real allocation. A good allocator reports the mistake instead of scribbling on memory or crashing. Today you validate every offset.
goal: Reject frees of offsets that are not valid payload starts, without panicking.
spec:
  scenario: Invalid offsets are refused cleanly
  status: failing
  lines:
    - kw: Given
      text: 'a 64-byte heap where Malloc(16) returned offset 8, giving blocks (0, 32, allocated) and (32, 32, free)'
    - kw: When
      text: 'Free(7), Free(1000), and Free(16) are each called'
    - kw: Then
      text: 'each returns an error and none panics: 7 is misaligned, 1000 is out of range, and 16 is inside a block rather than a payload start'
    - kw: And
      text: 'the heap is unchanged (Dump still 0:32:A|32:32:F) and Check reports nil'
code:
  lang: go
  source: |
    func (a *Allocator) valid(payload int) bool {
      if payload < 8 || payload >= len(a.buf) || payload%8 != 0 { return false }
      // the payload must sit exactly 8 bytes past a real block start
      for off := 0; off < len(a.buf); {
        size, _ := a.blockAt(off)
        if off+8 == payload { return true }
        off += size
      }
      return false
    }
checkpoint: The allocator rejects invalid offsets without corrupting or crashing. Commit and stop here.
---

Callers make mistakes: they free a pointer into the middle of a block, a stale
offset, or plain garbage. A real allocator that trusts these blindly reads a bogus
header and corrupts itself; a good one **validates** first. An offset is only a legal
payload if it is aligned, inside the arena, and sits exactly 8 bytes past the start
of a genuine block - which you confirm by walking the implicit list and matching the
block start.

Reject anything else with an error and leave the heap untouched - never panic on
bad input. A misaligned offset, an out-of-range offset, and an offset that lands
inside a block instead of at a payload boundary are all caught. Combined with the
double-free guard, `Free` is now robust against the ordinary ways a caller can
misuse it, which is what makes the allocator safe to actually hand to someone. All
that remains is to prove the whole thing works end to end.
