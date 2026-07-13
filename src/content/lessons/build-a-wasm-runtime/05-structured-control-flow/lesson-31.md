---
project: build-a-wasm-runtime
lesson: 31
title: Branching with br
overview: 'A branch is how a WebAssembly program breaks out of a block. Today you add br, the unconditional branch, and pin that branching to a block jumps to just past its end.'
goal: Execute br to unwind to a labeled block and continue just past that block's end.
spec:
  scenario: Branching out of a block
  status: failing
  lines:
    - kw: Given
      text: the interpreter running a body that contains a block
    - kw: When
      text: 'br 0 executes inside the block'
    - kw: Then
      text: '02 40 0C 00 41 09 0B 0B (block, br 0, i32.const 9, end, end) skips the rest of the block, so 9 is never pushed and the stack stays empty'
    - kw: And
      text: 'br takes a label depth: br 0 targets the innermost enclosing block, br 1 the next one out'
code:
  lang: go
  source: |
    // br (0x0C) reads a label depth. Branching pops that many inner labels and
    // jumps to the chosen label's target. A block's target is just past its end.
    case 0x0C: // br
      depth := readVarU32(body, &pc)
      label := labels[len(labels)-1-int(depth)]
      labels = labels[:len(labels)-1-int(depth)] // unwind inner labels
      pc = label.Target
checkpoint: The engine can branch out of a block with br. Commit and stop here.
---

A **branch** in WebAssembly names a label by **depth**, not by an address: `br 0` targets the innermost enclosing region, `br 1` the one outside that, and so on. That is why the label stack from the last lesson exists - the branch counts outward through it. `br` (`0x0C`) is the **unconditional** branch: it always transfers control to the named label. Branching unwinds all the labels inside the target too, since you are leaving those regions on the way out.

The behavior to pin is **where a block branch lands**. Branching to a `block`'s label jumps to just past that block's `end` - it **exits** the region, skipping whatever instructions remained. So in `block { br 0; i32.const 9 }` the `br 0` leaves the block immediately and the `i32.const 9` never runs, leaving the stack empty. This is exactly a structured `break`: escape to the end of the enclosing block. Hold onto that "branch to a block goes to its end" rule, because the very next distinction - what happens when you branch to a `loop` instead - is the single subtlety that trips everyone up.
