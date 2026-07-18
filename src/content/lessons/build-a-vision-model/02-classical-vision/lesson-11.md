---
project: build-a-vision-model
lesson: 11
title: Gradient magnitude
overview: SobelX and SobelY each report one direction of change, but "how strong is the edge here" wants a single number regardless of direction. Today you combine the two into one, the same way you would find the length of any two-dimensional vector.
goal: Combine the Gx and Gy grids from lesson 10 into a single gradient magnitude, and confirm it collapses to Gx alone on a purely vertical edge.
spec:
  scenario: Combining Gx and Gy into one strength
  status: failing
  lines:
    - kw: Given
      text: 'the Gx and Gy grids from lesson 10 on the vertical-edge image: Gx is 0 in the left column and 760 elsewhere, Gy is 0 everywhere'
    - kw: When
      text: the gradient magnitude is computed pixel by pixel as the square root of Gx squared plus Gy squared
    - kw: Then
      text: 'the magnitude grid equals Gx exactly, since Gy is 0 everywhere - the centre value is 760'
    - kw: And
      text: 'the left column, where Gx is 0, has a magnitude of 0 too'
code:
  lang: go
  source: |
    // magnitude at a pixel: the length of the (Gx, Gy) vector there
    func magnitude(gx, gy float64) float64 {
      return math.Sqrt(gx*gx + gy*gy)
    }
checkpoint: You can now report a single edge-strength number per pixel instead of two directional ones, and confirmed a purely vertical edge is captured entirely by Gx, with Gy dropping out completely. Commit and stop for today.
---

Sobel gives you two numbers per pixel - a left-right gradient and a top-bottom one - but most uses of an edge map want one number: how strong is the edge here, regardless of which way it runs. Treat `(Gx, Gy)` as a two-dimensional vector and the answer is its length, the same Euclidean distance formula you would use for two points on a plane.

On today's vertical-edge image that combination has a clean outcome worth noticing: because Gy is 0 everywhere, the magnitude grid is identical to Gx on its own. That will not hold for every image - a diagonal edge lights up both kernels at once - but it is a useful sanity check right now, and a reminder that magnitude only discards direction, not information a single-axis gradient was already missing.
