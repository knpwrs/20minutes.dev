---
project: build-a-vision-model
lesson: 17
title: ReLU
overview: A conv layer output can be negative, but a network usually wants to discard negative signal before passing it on. Today you build ReLU, the simplest possible way to do that.
goal: Apply ReLU, replacing any value at or below 0 with 0, elementwise to both channels from lesson 16.
spec:
  scenario: Clipping negative values in a two-channel feature map
  status: failing
  lines:
    - kw: Given
      text: 'channel 0 from lesson 16, whose values are -1, 2, 2, -1 in every row, and channel 1, whose values are 0.5, 0.5, 1.5, 1.5 in every row'
    - kw: When
      text: 'ReLU is applied to every value in both channels - a value at or below 0 becomes 0, a positive value is left unchanged'
    - kw: Then
      text: 'channel 0 becomes 0, 2, 2, 0 in every row - both negative entries clip to 0 while the two positive ones survive untouched'
    - kw: And
      text: 'channel 1 is unchanged - none of its values were 0 or negative to begin with'
    - kw: When
      text: 'ReLU is applied to a single much larger value, 1000'
    - kw: Then
      text: 'it comes back as 1000, unchanged - ReLU clips only from below and has no upper limit at all, unlike the brightness adjustment in lesson 4, which saturated at 255 in both directions'
code:
  lang: go
  source: |
    func relu(x float64) float64 {
      if x > 0 {
        return x
      }
      return 0
    }
checkpoint: You have a ReLU that clips negative signal to 0 and leaves positive signal alone, applied across every channel from lesson 16. Commit and stop for today.
---

A point operation is not new - lesson 4 built brightness and contrast the same shape, one input pixel to one output pixel, no neighbours involved. **ReLU** (rectified linear unit) is the point operation a network reaches for almost everywhere: keep a value if it is positive, replace it with 0 otherwise. Nothing about a pixel's position or its neighbours matters, only its own sign.

The reason it matters here is what it throws away. Watch channel 0 in today's spec: two of its four values were negative and become a flat 0, permanently discarding whatever information they carried at those exact positions. That is intentional and it is the whole point - a network learns to route the signal it wants through positive values, and ReLU is the layer that enforces "no signal" wherever a kernel produced a negative one. Keep this feature map close, because the columns ReLU zeroes here matter again once gradients start flowing backward through this same layer.

The asymmetry is worth noticing while you are here. Lesson 4's point operations were **saturating** - they clipped at both ends, because a pixel had to stay inside a byte. ReLU clips at one end only. A value of `1000` passes through it completely untouched, and so would a million; there is no ceiling anywhere in the function. That is a deliberate property rather than an oversight, and it is the reason activations in a deep network can grow without bound as they stack up - a real problem that layer normalization exists to solve, and one you will not have to face at this project's scale.
