---
project: build-a-tts-model
lesson: 36
title: 'One gradient step'
overview: 'Fitting a linear model needs a gradient, and for squared error over a linear prediction that gradient has a closed form - no autograd required. Today you derive it and take exactly one step.'
goal: 'Derive the closed-form gradient of squared-error loss for a linear model and take one SGD step from pinned zero weights.'
spec:
  scenario: 'Taking one gradient step from zero weights'
  status: failing
  lines:
    - kw: Given
      text: 'a linear model predicting duration as the dot product of weights [0,0,0] and a row''s features, with per-example loss (prediction minus actual duration) squared, and a learning rate of 0.02'
    - kw: When
      text: 'the loss is computed over the full 6-row dataset at these initial weights, before any update'
    - kw: Then
      text: 'the loss is approximately 23366.6666666667 (to within 1e-6) - every prediction is 0, so the loss reduces to the mean of each row''s duration squared'
    - kw: When
      text: 'one SGD step is taken using only row 0 (stressed=0, final=0, duration 120 ms) and the gradient of its squared error with respect to each weight'
    - kw: Then
      text: 'the updated weights are exactly [4.8, 0, 0]'
    - kw: And
      text: 'the full-dataset loss at these updated weights is approximately 21949.7066666667 (to within 1e-6) - lower than before the step, even though only one row informed it'
code:
  lang: go
  source: |
    // chain rule: the gradient of (pred-y)^2 needs d(pred)/dw_k first - and
    // pred is linear in w, so that part is just x_k. Combine it with the
    // derivative of squaring (pred-y) to get each grad[k] - work it out,
    // don't guess the combined form
    pred := Predict(w, x)
    diff := pred - y
checkpoint: 'One real gradient step now measurably lowers the model''s loss, derived by hand rather than pulled from a library. Commit and stop for today.'
---

A linear model's prediction is a dot product, `w0*1 + w1*stressed +
w2*final`, and its loss on one example is the squared difference between
that prediction and the real duration. Differentiating a squared difference
of a linear function is exactly the kind of gradient that never needs an
automatic differentiation engine - the chain rule gives a closed form for
each weight directly, small enough to write out and check by hand.

Starting from all-zero weights, every prediction is `0`, so the loss over
the whole dataset collapses to the mean of each duration squared - a useful
sanity check before any training happens at all. One step of stochastic
gradient descent, using only the dataset's first row and its own closed-form
gradient, nudges the weights away from zero and measurably lowers the loss
computed over the *entire* dataset - a first hint that a model can
generalize a little even from a single example, well before real training
begins.
