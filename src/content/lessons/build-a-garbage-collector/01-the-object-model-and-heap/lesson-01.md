---
project: build-a-garbage-collector
lesson: 1
title: The heap of object slots
overview: A garbage collector manages a heap of objects, so first we need a heap. Ours is a simulated one - a fixed table of object slots - so that every object has a plain integer id and every collection is fully deterministic and testable. Today you build that heap and report its capacity.
goal: Create a heap with a fixed number of object slots and report how many it holds.
spec:
  scenario: A newly created heap knows its capacity and starts empty
  status: failing
  lines:
    - kw: Given
      text: 'a new heap created with NewHeap(8)'
    - kw: When
      text: 'its Capacity and Live counts are queried'
    - kw: Then
      text: 'Capacity reports 8 and Live reports 0'
    - kw: And
      text: 'a separate heap created with NewHeap(4) reports Capacity 4, independent of the first'
code:
  lang: go
  source: |
    // the whole collector will manage objects inside this one table of slots
    type Heap struct {
      slots []*object // one slot per object; nil means the slot is free
    }
    func NewHeap(capacity int) *Heap { return &Heap{slots: make([]*object, capacity)} }
    func (h *Heap) Capacity() int { return len(h.slots) }
    func (h *Heap) Live() int { /* count non-nil slots */ }
checkpoint: You have a fixed-capacity heap that reports its size and starts empty. Commit and stop here.
---

A real garbage collector runs inside a language's runtime and manages memory the
operating system handed it, chasing real pointers. That is impossible to test with
exact values and different in every language, so we do the honest teaching version:
a **simulated heap**. The heap is a fixed table of **slots**, one per object, and
every object is identified by an integer **id** - the index of its slot. No real
pointers, no runtime magic, and every result is a number you can assert.

Today is deliberately tiny: a heap of a chosen number of slots that reports its
**capacity** and how many slots are **live** (in use). That capacity is the total
number of objects our collector will ever hold at once - it never grows - so knowing
it precisely is where everything starts. Every later lesson fills, traces, and
reclaims these same slots.
