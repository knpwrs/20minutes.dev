---
project: build-a-wav-pcm-toolkit
lesson: 25
title: Panning a mono signal
overview: Panning places a mono sound anywhere across the stereo field by giving each side a different share of the level. Today you build a simple linear pan, closing the DSP chapter.
goal: Pan a mono signal into stereo using per-side gains from a pan position.
spec:
  scenario: A pan position sets the left and right gains
  status: failing
  lines:
    - kw: Given
      text: 'the mono sample 1000 and a pan position p in [-1, +1], with leftGain (1-p)/2 and rightGain (1+p)/2'
    - kw: When
      text: 'p is -1 (hard left), then +1 (hard right), then 0 (center), then +0.5'
    - kw: Then
      text: 'the (left, right) pairs are (1000, 0), (0, 1000), (500, 500), and (250, 750)'
    - kw: And
      text: 'p at -1 sends the whole signal to the left channel and nothing to the right'
code:
  lang: go
  source: |
    func pan(sample int, p float64) (left, right int) {
      lg := (1 - p) / 2       // p=-1 -> 1.0 ; p=+1 -> 0.0
      rg := (1 + p) / 2
      left = int(math.Round(float64(sample) * lg))
      right = int(math.Round(float64(sample) * rg))
      return
    }
checkpoint: You can pan a mono signal across the stereo field. The DSP chapter is complete; commit and stop here.
---

**Panning** positions a mono source in the stereo image by splitting its level
between the two channels. A **pan position** `p` runs from `-1` (hard left) through
`0` (center) to `+1` (hard right), and it sets two gains: `leftGain = (1 - p)/2` and
`rightGain = (1 + p)/2`. At `p = -1` the left gain is `1` and the right is `0`, so
the sound is entirely on the left; at `p = +1` it flips; at center each side gets
half.

So a `1000` sample pans to `(1000, 0)` hard left, `(0, 1000)` hard right, `(500,
500)` center, and `(250, 750)` at `p = +0.5` - biased right. This is the **linear**
pan law, the simplest of several (constant-power panning keeps perceived loudness
steady across the sweep by using a sine/cosine curve, a refinement you could add
later). It is the last of the sample-math tools, and it turns the mono tones you are
about to synthesize into signals you can place anywhere in the field.
