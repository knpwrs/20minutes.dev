---
project: build-a-qr-code-encoder
lesson: 23
title: The empty grid
overview: 'A QR symbol is a square grid of modules, each dark or light. Before placing anything you need the grid itself and a way to tell an unset module from a decided one. Today you build that grid for Version 1.'
goal: 'Create the Version 1 module grid with every module initially unset.'
spec:
  scenario: 'A fresh grid of the right size'
  status: failing
  lines:
    - kw: Given
      text: 'a Version 1 symbol, whose side length is 4*version + 17 modules'
    - kw: When
      text: 'a new grid is created for Version 1'
    - kw: Then
      text: 'it is 21 by 21 modules'
    - kw: And
      text: 'every module starts unset - distinct from both dark and light - so later steps can tell which modules still need a value'
code:
  lang: go
  source: |
    // Three states per module: unset, dark, light. Use a pointer
    // or a -1 / 0 / 1 sentinel so "unset" is distinguishable.
    type Grid struct {
      size    int
      modules [][]int8 // -1 unset, 0 light, 1 dark
    }
    func NewGrid(version int) *Grid {
      n := 4*version + 17
      // ... fill with -1
    }
checkpoint: 'You have an empty Version 1 grid. Commit and stop here.'
---

A QR symbol is a grid of square **modules**, each either dark or light, and the grid is always square with an odd side length. The side length is `4 * version + 17`, so **Version 1 is 21 by 21**. Every larger version adds four modules per side. This grid is the canvas the rest of the chapter draws on.

The subtlety is that you need **three** states, not two. As you place finder patterns, timing lines, and data, you must know which modules are still empty so you do not overwrite a function pattern with data or place data twice. So each module is `unset`, `dark`, or `light`, and a fresh grid is entirely `unset`. Represent that however you like - a sentinel value, a pointer, a parallel "reserved" mask - as long as "not yet decided" is distinct from "decided light". Everything from here writes into this grid.
