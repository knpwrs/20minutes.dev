---
project: build-a-vision-model
lesson: 26
title: ReLU backward
overview: ReLU forward was a step - keep positive, flatten everything else. Today you differentiate that step to get its backward pass, and settle what happens at exactly zero.
goal: Apply ReLU backward to the gradient lesson 25 produced, using lesson 15's pre-activation values to decide where the derivative is 1 and where it is 0.
spec:
  scenario: Backward pass through an elementwise clip
  status: failing
  lines:
    - kw: Given
      text: 'the gradient lesson 25 routed back through pooling, and the pre-activation values from lesson 15 - channel 0 reads -1, 2, 2, -1 in every row, channel 1 reads 0.5, 0.5, 1.5, 1.5 in every row'
    - kw: When
      text: 'the upstream gradient is multiplied position by position by the derivative of the clip, which is 1 where the pre-activation was strictly greater than 0 and 0 everywhere else'
    - kw: Then
      text: 'channel 0 row 0 is 0, about -0.74963, about 0.25037, 0 - and channel 1 passes through unchanged, since every one of its pre-activation values was positive'
    - kw: When
      text: 'the same rule is applied directly to a single row of four pre-activation values -1, 2, 0 and 3, with an upstream gradient of 0.5 at all four positions'
    - kw: Then
      text: 'the result is 0, 0.5, 0, 0.5'
    - kw: And
      text: 'the third position is 0 even though its pre-activation was exactly 0 - the test is strictly greater than zero, so a pre-activation sitting exactly on the hinge passes no gradient'
code:
  lang: go
  source: |
    // differentiate max(0, x) with respect to x - it is a step.
    // multiply the upstream gradient by that step at each position, using
    // lesson 15's pre-activation to know which side of the hinge you are on.
    // decide deliberately what happens when a pre-activation is exactly 0
    func reluBackward(upstream, preActivation [][]float64) [][]float64 {
      out := make([][]float64, len(upstream))
      return out
    }
checkpoint: You have derived ReLU backward from its forward definition and pinned its behaviour at exactly zero. Gradient now flows back to the convolution's own output. Commit and stop for today.
---

ReLU's forward rule was a step: keep a positive value, replace anything else
with `0`. Its backward rule falls straight out of differentiating that step. The
derivative of `max(0, x)` is `1` wherever `x` was positive and `0` wherever it
was not, and the chain rule says to multiply the upstream gradient by that
derivative position by position, reading the sign from the exact pre-activation
values lesson 15 computed.

Two things are worth pausing on. The first is that the network's own numbers come
out **unchanged** here, and that is not a bug - it is a property of this example.
Pooling only ever selects the largest value in a window, and in every window here
that winner was already positive, so ReLU has nothing left to zero that pooling
had not already zeroed. That is why today's spec also applies the rule to a plain
row of four values: on data where a non-positive pre-activation actually receives
gradient, the rule visibly bites. The second is the hinge itself. At exactly `0`,
`max(0, x)` has no derivative - the function has a corner there, and the true
answer is a matter of convention rather than calculus. Every framework picks one
and moves on; this project picks `0`, testing strictly greater than zero. Pick it
deliberately rather than by accident, because a stray `>=` is invisible until it
is not.
