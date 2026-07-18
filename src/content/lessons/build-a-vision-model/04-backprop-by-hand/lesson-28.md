---
project: build-a-vision-model
lesson: 28
title: Checking gradients numerically
overview: Every backward-pass formula in this chapter was derived by hand, and hand derivations have bugs. Today you check one against a numerical estimate that needs no calculus at all.
goal: Estimate dL/d(param) by central difference with epsilon 1e-4 for one conv weight and one dense weight, and compare each to its analytic value from lessons 24 and 27.
spec:
  scenario: Gradient checking by central difference
  status: failing
  lines:
    - kw: Given
      text: 'the pinned weight ConvW channel 0, row 0, column 2, equal to 1 from lesson 15, and an epsilon of 1e-4'
    - kw: When
      text: 'the loss - the full forward pass from lesson 15 through lesson 22, run twice, once with that weight nudged up by epsilon and once nudged down - is used to estimate the derivative as the loss at plus epsilon minus the loss at minus epsilon, divided by 2 times epsilon'
    - kw: Then
      text: 'the numerical estimate is about 0.249627365, matching the analytic dConvW value from lesson 27 to a relative error of about 2.5e-11 - well inside a tolerance of 1e-6'
    - kw: And
      text: 'checking the same way for DenseW row 2, column 3, equal to 0.1 from lesson 20, gives an analytic value of about 1.248136825, a numerical estimate of about 1.248136824, and a relative error of about 6.2e-10'
code:
  lang: go
  source: |
    // central difference: perturb the parameter both directions by epsilon,
    // rerun the ENTIRE forward pass and loss each time, not just this layer
    const epsilon = 1e-4
    func numericalGrad(lossAt func(perturbed float64) float64, original float64) float64 {
      return (lossAt(original+epsilon) - lossAt(original-epsilon)) / (2 * epsilon)
    }
checkpoint: You have proven the whole chapter's derivations against an independent method that needed no chain rule at all, with a small honest error left over rather than a suspiciously perfect zero. Commit and stop for today.
---

Every gradient in this chapter came from hand-derived calculus, applied through five layers - dense, ReLU, max-pool and conv, chained together. A single sign error or a swapped index anywhere in that chain would silently produce a wrong number, one that still looks plausible on its own. **Gradient checking** catches that class of bug without trusting any of the derivations: nudge one parameter up by a small epsilon, nudge it down by the same amount, rerun the entire forward pass and loss both times, and estimate the slope directly from those two loss values.

Today's epsilon is 1e-4, small enough to approximate a derivative well but large enough that floating point rounding does not swamp it. The two checks land at a relative error around 1e-10, not exactly 0 - central difference is itself only an approximation, so a perfect match would be more suspicious than reassuring. A tolerance of 1e-6 comfortably separates "this derivation is correct" from "this derivation has a real bug", which is the only claim gradient checking needs to make.
