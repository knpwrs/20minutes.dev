---
project: build-an-llm
lesson: 9
title: Exp and log
overview: 'Exp and log are inverses of each other, and each has an unusually clean derivative. Today you give both a backward closure.'
goal: Give Exp and Log backward closures - the two halves of one inverse pair.
spec:
  scenario: Backpropagating through exp and its inverse
  status: failing
  lines:
    - kw: Given
      text: 'x=1.0, and y built by applying exp to x'
    - kw: When
      text: 'Backward is called on y'
    - kw: Then
      text: 'y.Data is about 2.718282'
    - kw: And
      text: 'x.Grad is about 2.718282 - equal to y.Data itself'
    - kw: When
      text: 'instead x=2.0, and y is built by applying log to x, then Backward is called on y'
    - kw: Then
      text: 'y.Data is about 0.693147'
    - kw: And
      text: 'x.Grad is exactly 0.5'
code:
  lang: go
  source: |
    // Exp's derivative equals itself, evaluated at this input - reuse e
    // below. Log needs the same shape, but its derivative is a reciprocal
    // of ITS INPUT (not of the value log produced)
    func Exp(a *Value) *Value {
      e := math.Exp(a.Data)
      out := &Value{Data: e, children: []*Value{a}, op: "exp"}
      out.backward = func() {
        // route out.Grad to a.Grad using exp's own derivative here
      }
      return out
    }
checkpoint: 'Exp and log both route gradient correctly, and log is ready for the cross-entropy loss that needs it several chapters from now. Commit and stop for today.'
---

`exp` and `log` are inverses of each other - `log(exp(x))` gets you back to `x` - and that relationship shows up again in how cleanly each one differentiates. `exp`'s derivative is famously equal to `exp` itself: whatever value the forward pass already computed is exactly the local gradient the backward pass needs, with nothing further to work out. `log`'s derivative is almost as clean, but it is a reciprocal of the value that went *in*, not the value that came out - a distinction worth being deliberate about, since the two are easy to swap by accident.

Both belong in the same lesson because they are two faces of the one idea - an operation and its inverse, each turning out to have one of the simplest derivatives in the engine. `log` in particular is not needed by anything you have built yet, but a loss function several chapters away turns a predicted probability into a number worth minimising by taking its log, and it will reach for exactly the closure you write today.
