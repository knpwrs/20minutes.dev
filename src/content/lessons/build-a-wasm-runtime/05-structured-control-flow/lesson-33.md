---
project: build-a-wasm-runtime
lesson: 33
title: Loops and the backward branch
overview: 'A loop looks like a block but branches the other way, and that one difference is what makes iteration possible. Today you add loop and pin that branching to a loop jumps to its top, not its end.'
goal: Execute loop so that a branch to its label re-enters the loop from the top, letting a counted loop run to completion.
spec:
  scenario: Iterating with a loop and a backward branch
  status: failing
  lines:
    - kw: Given
      text: 'a function with a local $i set to 3 and a local $sum set to 0, containing a block around a loop'
    - kw: When
      text: 'the loop adds $i to $sum, decrements $i, and br 0 branches back to the loop while br_if 1 exits when $i reaches 0'
    - kw: Then
      text: 'branching to the loop label jumps to the loop''s first instruction, so the body runs once per value of $i and $sum ends at 3 + 2 + 1 = 6'
    - kw: And
      text: 'branching to the enclosing block label still jumps past its end, so br_if 1 leaves the loop when $i is 0'
code:
  lang: go
  source: |
    // loop (0x03) is like block, but its label's Target is the loop's TOP, not
    // its end. So br to a loop repeats it; br to a block exits it.
    case 0x03: // loop
      bt := readBlockType(body, &pc)
      labels = append(labels, Label{Arity: bt.params, Target: pc, IsLoop: true})
    // block target = matchingEnd(...);  loop target = the instruction after loop.
    // Two co-requisites: a branch to a loop must KEEP that loop's label on the
    // control stack (you re-enter, so it can be branched to again), and your
    // end-matching scan must count nested loop opens too, not just blocks.
checkpoint: The engine can run real loops. Commit and stop here.
---

A `loop` (`0x03`) is written just like a `block` - a blocktype, a body, a matching `end` - but its label points the **other way**. Branching to a `block`'s label jumps forward, past its `end`, exiting the region. Branching to a `loop`'s label jumps **backward, to the loop's first instruction**, re-entering it. That single difference in where the label target points is the entire mechanism of iteration in WebAssembly, and it is the thing everyone gets backwards at first. A `loop` does not repeat on its own; it repeats only because something inside it branches back to its label.

Adding `loop` also refines what a branch does: branching to a `block` label leaves that region for good, so its label comes off the control stack, but branching to a `loop` label re-enters the region, so the loop's label must **stay** (or the second time around there would be nothing to branch back to). That is why the counting idiom wraps a `loop` inside a `block`: `br` to the inner `loop` label repeats, and `br_if` to the outer `block` label exits. Reaching a loop's `end` normally (without branching back) just falls out the bottom, so the loop must explicitly `br` to keep going. Trace the example: `$i` starts at `3`, each pass adds `$i` to `$sum` and decrements `$i`, `br 0` returns to the loop top, and when `$i` hits `0` the `br_if 1` escapes to the block's end - leaving `$sum` at `3 + 2 + 1 = 6`. With this, the engine runs genuine bounded loops, and the capstone's factorial is the same shape.
