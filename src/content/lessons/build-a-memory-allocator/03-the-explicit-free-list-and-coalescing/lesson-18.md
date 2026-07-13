---
project: build-a-memory-allocator
lesson: 18
title: A heap snapshot
overview: You have been asserting heap layouts block by block; now render one as a single string. Dump gives a compact, deterministic picture of the whole heap, handy for debugging and the exact target the capstone checks against.
goal: Render the block layout as one deterministic string.
spec:
  scenario: Dump renders the heap in address order
  status: failing
  lines:
    - kw: Given
      text: 'a 64-byte heap where Malloc(16) has produced (0, 32, allocated) and (32, 32, free)'
    - kw: When
      text: 'Dump is called'
    - kw: Then
      text: "it returns exactly '0:32:A|32:32:F' (each block as offset:size:A-or-F, joined by a pipe)"
    - kw: And
      text: "a fresh 64-byte heap dumps as '0:64:F'"
code:
  lang: go
  source: |
    func (a *Allocator) Dump() string {
      parts := []string{}
      for _, b := range a.Blocks() {
        flag := "F"
        if b.Alloc { flag = "A" }
        parts = append(parts, fmt.Sprintf("%d:%d:%s", b.Off, b.Size, flag))
      }
      return strings.Join(parts, "|")
    }
checkpoint: The allocator can print its whole layout as one string. Commit and stop here.
---

You have a full block allocator now: it splits, frees, and coalesces on both sides,
all tracked through an explicit free list. `Dump` turns the whole layout into one
readable line - each block as `offset:size:A` or `offset:size:F`, joined by pipes,
in address order. It is the same information `Blocks` returns, in a form you can eyeball
in a log or assert as a single value.

That single-value view is worth having: the capstone at the end of the project runs
a whole workload and checks the exact `Dump` string of the final heap. For now it
closes out the core allocator on a satisfying note - one call that shows the entire
state of memory. The next chapter makes allocation smarter (best-fit) and richer
(realloc, calloc).
