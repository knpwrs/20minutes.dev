---
project: build-a-garbage-collector
lesson: 13
title: The tri-color state
overview: Mark-sweep tracks its progress by coloring objects white, gray, or black. Today you build that color state so the mark phase has somewhere to record what it has seen and what it still must scan.
goal: Give every object a color, defaulting to white, that can be read and set.
spec:
  scenario: Objects carry a tri-color mark, white by default
  status: failing
  lines:
    - kw: Given
      text: 'a heap with objects a = 0, b = 1 allocated'
    - kw: When
      text: 'their colors are queried before any marking'
    - kw: Then
      text: 'Color(0) and Color(1) are both White'
    - kw: And
      text: 'after SetColor(0, Gray) then SetColor(0, Black), Color(0) is Black while Color(1) is still White'
code:
  lang: go
  source: |
    type color int
    const ( White color = iota; Gray; Black ) // White is the zero value, the default

    // store a color per slot, parallel to the object table
    func (h *Heap) Color(r Ref) color      { return h.colors[r] }
    func (h *Heap) SetColor(r Ref, c color) { h.colors[r] = c }
checkpoint: Every object carries a tri-color mark that starts white. Commit and stop here.
---

The **tri-color abstraction** is the bookkeeping the mark phase runs on. Every object
is one of three colors. **White** means "not yet proven reachable" - the presumed-dead
state everything starts in. **Gray** means "known reachable, but its children have not
been scanned yet" - the work queue. **Black** means "reachable, and all its children
have been greyed" - fully processed. Marking is the process of driving reachable
objects from white through gray to black; whatever is still white at the end is
garbage.

Today just add the state: a color per object, defaulting to **white** (make it the
zero value so a fresh object is white for free), with a getter and setter. This is the
canvas; the next lesson paints it. Keeping the three colors as an explicit invariant -
white unproven, gray pending, black done - is what will let you state and check the
central correctness property of the whole collector two lessons from now.
