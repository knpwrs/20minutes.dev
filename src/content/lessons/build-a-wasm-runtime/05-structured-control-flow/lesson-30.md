---
project: build-a-wasm-runtime
lesson: 30
title: Blocks and the label stack
overview: 'WebAssembly has no jumps to arbitrary addresses; control flow is structured, nested inside block and loop. Today you add the block instruction and the label stack that every branch will target.'
goal: Execute a block and its end, pushing and popping a label that records where a branch to it would land.
spec:
  scenario: Entering and leaving a block
  status: failing
  lines:
    - kw: Given
      text: the interpreter running a body
    - kw: When
      text: 'a block and its matching end execute'
    - kw: Then
      text: '02 40 41 07 0B 0B (block, empty result, i32.const 7, end, end) runs the block body and leaves 7 on the stack'
    - kw: And
      text: 'nested blocks track depth: 02 40 02 40 0B 0B 0B (a block containing an empty block) runs to completion with the stack unchanged'
code:
  lang: go
  source: |
    // block (0x02) is followed by a blocktype byte: 0x40 means "no result",
    // or a value-type byte means one result. Push a label; end (0x0B) pops it.
    type Label struct { Arity int; Target int; IsLoop bool }
    case 0x02: // block
      bt := readBlockType(body, &pc)
      labels = append(labels, Label{Arity: bt.results, Target: matchingEnd(body, pc)})
checkpoint: You have a label stack that blocks push onto and end pops. Commit and stop here.
---

Every language that compiles to WebAssembly has `if`, loops, and `break`, but WebAssembly does not offer a raw "jump to address" to build them from. Instead control flow is **structured**: instructions nest inside `block` and `loop` regions, and you can only branch **out to an enclosing region**, never into the middle of one. That restriction is what makes a module safe to validate and simple to reason about. `block` (`0x02`) opens such a region and its matching `end` (`0x0B`) closes it.

The machinery underneath is a **label stack**. Entering a `block` pushes a label; reaching its `end` pops it. Each label records two things a branch will need: how many result values the region produces (its **arity**, from the blocktype byte - `0x40` for none, or a value-type byte for one), and where a branch aimed at this label should land. For a plain `block` that landing spot is just past its `end`. Today the block only executes its body straight through and pops its label at the end; the next lessons make branches actually use these targets. Getting the push/pop balance right, even through nesting, is the whole job now.
