---
project: build-a-pathfinder
lesson: 12
title: A binary min-heap, pushing
overview: A weighted search must always expand the cheapest frontier cell next, which needs a priority queue. Today you start building one by hand, a binary min-heap in a slice, and get its push and peek right.
goal: Build a binary min-heap backed by a slice, with push and a peek at the minimum.
spec:
  scenario: Pushing keeps the smallest priority at the top
  status: failing
  lines:
    - kw: Given
      text: 'an empty min-heap of items, each item carrying a priority'
    - kw: When
      text: 'items with priorities 5, 3, 8 are pushed'
    - kw: Then
      text: 'Peek returns the item with priority 3'
    - kw: And
      text: 'after also pushing priorities 1 and 4, Peek returns the item with priority 1'
code:
  lang: go
  source: |
    type Item struct { Priority int; Cell Coord } // Seq is added in a later lesson
    type Heap struct { items []Item }
    func (h *Heap) Peek() Item { return h.items[0] }        // min is always at index 0
    func (h *Heap) Push(it Item) {
      h.items = append(h.items, it)                          // add at the end
      i := len(h.items) - 1
      for i > 0 {                                            // sift up while smaller than parent
        p := (i - 1) / 2
        if h.items[i].Priority >= h.items[p].Priority { break }
        h.items[i], h.items[p] = h.items[p], h.items[i]
        i = p
      }
    }
checkpoint: A min-heap keeps the smallest priority at its top as you push. Commit and stop here.
---

Dijkstra's algorithm needs to repeatedly pull out the **cheapest** frontier cell, so
a plain queue will not do. The right tool is a **priority queue**, and the classic
implementation is a **binary min-heap**: a complete binary tree, flattened into a
slice, where every parent is no larger than its children. That invariant keeps the
smallest element sitting at index `0`, ready to peek in constant time.

Pushing keeps the invariant with a **sift up**. Append the new item at the end, then
walk it toward the root, swapping with its parent (`(i-1)/2`) as long as it is
smaller. It stops as soon as it reaches a parent no larger than itself. We build this
ourselves rather than reach for a library so the ordering is fully in our hands,
which matters in two lessons when equal priorities need a deterministic tie-break.
Popping the minimum back out is next.
