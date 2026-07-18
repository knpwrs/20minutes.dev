---
project: build-an-llm
lesson: 38
title: The transformer block (residuals + pre-LN)
overview: 'A transformer block wraps attention and the feed-forward network in residual connections, and normalizes the input to each sub-layer before it runs rather than after - the pre-LN convention this project commits to.'
goal: Compose layer normalization, multi-head attention, and the feed-forward network into one transformer block using residual connections and pre-LN.
spec:
  scenario: Running one full transformer block over the input
  status: failing
  lines:
    - kw: Given
      text: 'X (3x8) from lesson 26, the multi-head attention from lesson 35, the feed-forward network from lesson 36, and two separate layer normalizations (LN1 and LN2, each identity gamma/beta, from lesson 37)'
    - kw: When
      text: 'the block computes resid1 = X + MHA(LN1(X)), then output = resid1 + FFN(LN2(resid1)) - normalizing before each sub-layer runs, not after'
    - kw: Then
      text: 'resid1 (3x8) has row 0 [-0.193047, -0.475077, -0.032989, 0.396895, 0.304218, -0.193047, -0.475077, -0.032989], row 1 [0.22476, 0.197924, -0.258665, -0.093446, -0.070573, 0.22476, 0.197924, -0.258665], row 2 [-0.100146, 0.002926, 0.242286, -0.120377, -0.024689, -0.100146, 0.002926, 0.242286]'
    - kw: And
      text: 'the block''s final output (3x8) has row 0 [-0.148784, -0.519401, -0.134111, 0.442533, 0.359763, -0.148784, -0.519401, -0.134111], row 1 [0.124945, 0.130813, -0.09906, -0.088488, -0.068209, 0.124945, 0.130813, -0.09906], row 2 [-0.016017, 0.122993, 0.116538, -0.146147, -0.077367, -0.016017, 0.122993, 0.116538]'
code:
  lang: go
  source: |
    // pre-LN: normalize BEFORE each sub-layer runs, then add its
    // result back to the un-normalized residual stream (X, then resid1)
    func (b *Block) Forward(x *Tensor) *Tensor {
      resid1 := ElementwiseAdd(x, b.MHA.Forward(b.LN1.Forward(x)).Out)
      return ElementwiseAdd(resid1, b.FFN.Forward(b.LN2.Forward(resid1)))
    }
checkpoint: You have a complete transformer block - attention and a feed-forward network, each wrapped in a residual connection and normalized before it runs. Commit and stop for today.
---

A **transformer block** combines everything this chapter has built: multi-head attention lets positions share information, the feed-forward network processes each position on its own, and a **residual connection** around each one adds its output back onto its input rather than replacing it - `x + sublayer(x)`, so the original signal always survives even if the sub-layer's contribution is small. Two of these residual wrappers, one around attention and one around the feed-forward network, make up the whole block.

Where each sub-layer reads its input from is a genuine design fork with two named conventions: **pre-LN** normalizes the input before it enters the sub-layer (`x + MHA(LN(x))`), while **post-LN** runs the sub-layer first and normalizes the sum afterward (`LN(x + MHA(x))`). This project uses pre-LN throughout, the convention GPT-2 and nanoGPT use, and the two give different numbers - if your `resid1` does not match today's spec, check which side of the sub-layer your normalization landed on before anything else.
