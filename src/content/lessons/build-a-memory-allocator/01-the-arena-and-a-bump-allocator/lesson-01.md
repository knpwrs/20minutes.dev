---
project: build-a-memory-allocator
lesson: 1
title: The arena, a fixed backing buffer
overview: Every allocator needs memory to hand out. Ours is a simulated one - a single fixed byte buffer we call the arena - so that every allocation is just an offset into it, fully deterministic and testable. Today you build that buffer and report its size.
goal: Create an arena of a fixed number of bytes and report how many bytes it holds.
spec:
  scenario: A newly created arena knows its size
  status: failing
  lines:
    - kw: Given
      text: 'a new arena created with NewArena(64)'
    - kw: When
      text: 'its Size is queried'
    - kw: Then
      text: 'it reports 64'
    - kw: And
      text: 'a separate arena created with NewArena(16) reports 16, independent of the first'
code:
  lang: go
  source: |
    // the whole allocator will manage space inside this one buffer
    type Arena struct {
      buf []byte // the simulated memory; offsets index into it
    }
    func NewArena(size int) *Arena { return &Arena{buf: make([]byte, size)} }
    func (a *Arena) Size() int { return len(a.buf) }
checkpoint: You have a fixed-size arena that reports its capacity. Commit and stop here.
---

A real allocator asks the operating system for memory and hands back pointers.
That is impossible to test with exact values and different in every language, so
we do the honest teaching version instead: a **simulated arena**. The arena is
one fixed slab of bytes, and every allocation is an **offset** into it - a plain
integer saying "your memory starts here." No real pointers, no system calls, and
every result is a number you can assert.

Today is deliberately tiny: a buffer of a chosen size that can report how big it
is. That size is the total memory our allocator will ever have to work with - it
never grows - so knowing it precisely is where everything starts. Every later
lesson carves this same buffer into blocks.
