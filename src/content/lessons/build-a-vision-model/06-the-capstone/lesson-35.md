---
project: build-a-vision-model
lesson: 35
title: The full network
overview: Every lesson since chapter 3 called the six stages by hand, one function at a time. Today you bundle the pinned parameters and the whole pipeline into one network that answers both questions you can ask it.
goal: Define a network type holding every pinned parameter from lesson 30, giving it a Forward method for probabilities and a Predict method for the decision.
spec:
  scenario: Assembling the six stages into one network
  status: failing
  lines:
    - kw: Given
      text: 'a network type holding ConvW, ConvB, DenseW and DenseB, initialized with the exact pinned values from lesson 30, and a single Forward method that runs Conv2D(1 to 2 channels, 3x3, valid) then ReLU then MaxPool2x2 then Flatten then Dense(8 to 2) then Softmax, in that order'
    - kw: When
      text: 'Forward is called on sample i=0 from lesson 29, on the freshly initialized network, before any training step'
    - kw: Then
      text: 'the two output probabilities are about 0.51999 and 0.48001 - identical to the "before update" reading lesson 30 computed by chaining the same six functions by hand'
    - kw: And
      text: 'calling Forward again on the same sample, with no training in between, gives the exact same result - the network is a pure function of its parameters and its input, nothing hidden between calls'
    - kw: When
      text: 'a Predict method is added that runs Forward and returns the index of the largest probability instead of the whole vector'
    - kw: Then
      text: 'Predict on that same sample returns 0, since 0.51999 is the larger of the two'
    - kw: And
      text: 'Predict never reports a class whose probability is below every other - it is the argmax of exactly what Forward returned, not a second, separately computed answer'
code:
  lang: go
  source: |
    // Forward chains every stage in order, using n's own pinned parameters.
    // Predict is deliberately built ON Forward rather than beside it, so the
    // two answers can never disagree about the same input.
    func (n *Net) Forward(input [][][]float64) []float64 {
      // conv -> relu -> pool -> flatten -> dense -> softmax, in that order
    }
    func (n *Net) Predict(input [][][]float64) int {
      // the index of the largest value Forward returned
    }
checkpoint: You have one network object that owns its parameters and answers both questions - the full probabilities, and the single class it would pick. Commit and stop for today.
---

Every lesson from 15 onward built one stage - conv, ReLU, pooling, flatten, dense, softmax - and every training lesson since has been calling all six by hand, in the same order, every single time. That repetition is exactly what a type is for: bundle the four parameter tensors together and give the bundle one `Forward` method that runs the whole chain, so the rest of this project can call `net.Forward(image)` instead of remembering the six-stage recipe at every call site.

Nothing about the arithmetic changes - the `Forward` half of today's spec is really a consistency check, not a new computation. Feed sample 0 through the assembled network before any training and you should get exactly the probabilities lesson 30 already computed the long way. If the number does not match, the bundling introduced a bug.

`Predict` is the part worth thinking about. It answers a different question - not "how confident are you about each class" but "which one" - and the tempting mistake is to compute it separately, straight from the scores, skipping softmax as an optimization. It would even give the right answer, because softmax preserves order. Build it **on top of** `Forward` anyway. Two code paths that answer the same question about the same input are two things that can drift apart, and a classifier whose reported confidence disagrees with its own decision is a genuinely confusing thing to debug. One source of truth, two views of it.
