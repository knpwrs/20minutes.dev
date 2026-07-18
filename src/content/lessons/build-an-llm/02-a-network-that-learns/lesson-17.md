---
project: build-an-llm
lesson: 17
title: Zeroing the gradients between steps
overview: 'Calling Backward twice in a row does not error - it silently adds the new gradient on top of whatever was already sitting there. Today you find the bug, then fix it.'
goal: Build a ZeroGrad function that resets every collected parameter's gradient to zero, and confirm what breaks without it.
spec:
  scenario: Backward called twice without clearing gradients
  status: failing
  lines:
    - kw: Given
      text: 'a=3.0, and b built by multiplying a by the constant 2.0'
    - kw: When
      text: Backward is called on b once
    - kw: Then
      text: 'a.Grad is 2.0'
    - kw: When
      text: Backward is called on b again, with no gradient cleared in between
    - kw: Then
      text: 'a.Grad is now 4.0 - the second call added its 2.0 on top of the first, instead of replacing it'
    - kw: When
      text: 'ZeroGrad is called on the list of parameters containing a, and then Backward is called on b once more'
    - kw: Then
      text: 'a.Grad is back to 2.0'
code:
  lang: go
  source: |
    // gradients only ever ACCUMULATE (lesson 7) - Backward never assumes
    // it is starting from a clean slate, so nothing resets a parameter's
    // Grad between one training step and the next except this function
    func ZeroGrad(params []*Value) {
      // put every parameter's Grad back to its clean-slate value
    }
checkpoint: Training can now run step after step without gradients from the last step silently leaking into the next. Commit and stop for today.
---

Lesson 7 established that every backward closure adds to `.Grad` rather than replacing it, so that a value used twice in one graph collects the correct total. That same rule has a sharp edge you have not hit yet: nothing in `Backward` ever resets `.Grad` to zero before it starts. Call `Backward` on the same value a second time, and the new gradient lands on top of whatever the first call already left there - not because `Backward` is broken, but because it was never asked to forget.

Run today's spec by hand before writing any code: after one `Backward()` call, `a.Grad` is `2.0`. Call it again with nothing cleared in between, and `a.Grad` is `4.0` - the correct gradient for one pass, silently doubled by the second. This is exactly the shape of bug a training loop would hit on step two if nobody wrote today's fix, and it fails without a single error message, just a network that trains wrong. The remedy is to give yourself a function that walks every parameter and clears its `.Grad` before each step's `Backward` call - name it, and call it, every single time.
