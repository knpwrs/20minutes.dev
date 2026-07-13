---
project: build-a-memory-allocator
lesson: 2
title: A bump allocator
overview: The simplest allocator that works is a bump allocator - it keeps a cursor and hands out the next slice of the arena each time you ask. Today you build it, and suddenly the arena is usable, one allocation at a time.
goal: Hand out successive regions of the arena by advancing a cursor.
spec:
  scenario: Successive allocations return successive offsets
  status: failing
  lines:
    - kw: Given
      text: 'a fresh arena of 64 bytes with its cursor at 0'
    - kw: When
      text: 'Alloc(8) is called, then Alloc(8) again'
    - kw: Then
      text: 'the first returns offset 0 and the second returns offset 8'
    - kw: And
      text: 'after both, Used reports 16'
code:
  lang: go
  source: |
    // a cursor marks the boundary between used and free space
    func (a *Arena) Alloc(n int) (int, error) {
      off := a.cursor      // this allocation starts at the cursor
      a.cursor += n        // bump it past the region just handed out
      return off, nil
    }
    func (a *Arena) Used() int { return a.cursor }
checkpoint: The arena hands out successive regions by bumping a cursor. Commit and stop here.
---

A **bump allocator** (also called a linear or arena allocator) is the simplest
allocator that does something useful. It keeps a single **cursor** at the boundary
between the space it has handed out and the space still free. To allocate `n`
bytes it returns the cursor as the starting offset, then bumps the cursor forward
by `n`. That is the entire idea - no bookkeeping per allocation, just one moving
number.

Add a `cursor` field to the arena now; it starts at 0. Two allocations of 8 bytes
give offsets 0 and 8 because the first hands out bytes `[0, 8)` and leaves the
cursor at 8. It is fast and real, and it is the foundation the next few lessons
harden - out-of-space handling, alignment, and freeing.
