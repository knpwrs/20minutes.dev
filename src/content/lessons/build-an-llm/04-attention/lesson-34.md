---
project: build-an-llm
lesson: 34
title: Multiple heads
overview: 'One head sees the sequence through one set of Q, K, V weights - running several heads in parallel, each with its own weights, lets the model attend in more than one way at once.'
goal: Build a second attention head with its own Wq, Wk, Wv weights, and confirm it produces a genuinely different output from the first.
spec:
  scenario: Running two independent attention heads over the same input
  status: failing
  lines:
    - kw: Given
      text: 'X (3x8) from lesson 26, head 0 from lesson 33 (Wq seed 10, Wk seed 11, Wv seed 12), and a second head, head 1, built the same way but with Wq seed 13, Wk seed 14, Wv seed 15, all weights using the same formula and scale as lesson 28'
    - kw: When
      text: both heads run their full forward pass over X independently
    - kw: Then
      text: 'head 0''s output (3x4) is [[-0.045, -0.095, 0.1, 0.015], [-0.052458, -0.047768, -0.024295, 0.067204], [-0.038336, -0.014913, 0.008175, 0.043394]]'
    - kw: And
      text: 'head 1''s output (3x4) is [[-0.095, 0.1, 0.015, 0.035], [-0.047545, -0.02488, 0.06745, 0.054981], [-0.015061, 0.008667, 0.043178, 0.019903]]'
    - kw: And
      text: head 0's output and head 1's output are different at every entry, despite both heads reading the exact same X
code:
  lang: go
  source: |
    // same Head type as lesson 33, one instance per head - only the
    // seeds feeding Wq/Wk/Wv change between heads
    heads := []*Head{NewHead(0), NewHead(1)}
    var outs []*Tensor
    for _, h := range heads {
      outs = append(outs, h.Forward(x))
    }
checkpoint: You can run several independent attention heads over the same input and get genuinely different results from each. Commit and stop for today.
---

A single head can only attend in one way: its `Wq`, `Wk` and `Wv` weights fix one notion of "what to look for" and "what to advertise." **Multi-head attention** runs several heads side by side over the same input, each with its own independently pinned weights, so the model can attend to more than one kind of relationship at once - nothing about the `Head` type from lesson 33 changes, only how many instances of it exist.

Today's spec is really just lesson 33 run twice, with different seeds feeding the same construction. That head 0 and head 1 disagree at every single entry, from identical input, is the entire value of running more than one head - each has learned (here, been pinned) to look at the sequence differently, and the next lesson stitches their two outputs back into one.
