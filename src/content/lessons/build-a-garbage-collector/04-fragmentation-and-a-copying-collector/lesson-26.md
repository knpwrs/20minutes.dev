---
project: build-a-garbage-collector
lesson: 26
title: The flip
overview: Once the survivors are copied and their references fixed, the two spaces swap roles. Today you build the flip - to-space becomes the active space and the old space is cleared - the step that makes a copying collection permanent.
goal: Swap the semispaces so the compacted copies become active and the old space is reset.
spec:
  scenario: Flipping makes to-space the active heap
  status: failing
  lines:
    - kw: Given
      text: 'a copying heap of capacity 4 whose collection has copied one survivor into to-space slot 0 (to-space cursor at 1) and left the old from-space full of dead objects'
    - kw: When
      text: 'flip() is called'
    - kw: Then
      text: 'the active space is now the compacted one: Live() is 1, the allocation cursor is 1 (so the next New continues after the survivor), and Free() is 3'
    - kw: And
      text: 'the old space is cleared to nil and now serves as the empty reserve for the next collection, with the to-space cursor reset to 0'
code:
  lang: go
  source: |
    func (h *CopyingHeap) flip() {
      h.from, h.to = h.to, h.from // to-space becomes the active space
      h.next = h.toNext           // keep allocating after the copied survivors
      for i := range h.to { h.to[i] = nil } // wipe the old space; it is the new reserve
      h.toNext = 0
    }
checkpoint: Flipping the spaces completes a copying collection's move. Commit and stop here.
---

After copying and scanning, every live object has a compacted copy in to-space and
every reference points there; from-space holds nothing but corpses and forwarding
notes. The **flip** makes it official: swap the two halves so to-space becomes the
active space, set the allocation cursor to where copying stopped (survivors occupy the
prefix, free space is the contiguous run after them), and wipe the old half so it is a
clean reserve for next time.

This is where the copying collector pays off. Because the survivors were bump-copied
into to-space from slot 0, they come out **compacted** - no holes, all free space in one
block - which is exactly the fragmentation cure Chapter 4 opened with. The old space's
scattered layout simply ceases to exist. The one thing the flip does **not** do is
update the roots; they must be pointed at the copies during the collection itself,
which is the last piece the next lesson assembles into a full `Collect`.
