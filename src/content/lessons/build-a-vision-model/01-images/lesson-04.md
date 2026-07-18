---
project: build-a-vision-model
lesson: 4
title: Adjusting pixels one at a time
overview: The simplest thing you can do to an image is compute each new pixel from the old pixel in the same spot, ignoring its neighbours entirely. Today you build two of these, and meet the saturation that every one of them needs.
goal: Build brightness and contrast adjustments, both saturating rather than wrapping at the ends of the range.
spec:
  scenario: Point operations on a three-pixel row
  status: failing
  lines:
    - kw: Given
      text: 'an image whose pixels are 0, 128 and 255'
    - kw: When
      text: brightness is adjusted by adding 50
    - kw: Then
      text: 'the pixels are 50, 178 and 255 - the last one saturates instead of wrapping to 49'
    - kw: When
      text: 'the original image - not the brightened one - has its contrast scaled by 2.0 about the midpoint 127.5, rounding halves away from zero'
    - kw: Then
      text: 'the pixels are 0, 129 and 255'
    - kw: When
      text: 'the original image has its contrast scaled by 0.5 about the same midpoint'
    - kw: Then
      text: 'the pixels are 64, 128 and 191'
code:
  lang: go
  source: |
    // contrast pushes each pixel away from (or toward) the middle grey
    centered := float64(p) - 127.5
    scaled := centered*factor + 127.5
    // then round, then saturate into 0..255
checkpoint: Two point operations work, and both refuse to wrap around at the ends of the range. Commit and stop for today.
---

A **point operation** computes each output pixel from the input pixel at the
same coordinate and nothing else - move a pixel somewhere else in the image and
its result is unchanged. Brightness is the purest example: add a constant.
Contrast is the other classic: pick the middle grey and push every pixel away
from it (factor above 1) or pull every pixel toward it (factor below 1). These
two are worth building together because they are the same shape of thing - a
function from one pixel to one pixel - and because both immediately run into
the same problem.

That problem is the **edges of the range**. A pixel is a byte, and `255 + 50` in
a byte is `49` - your bright sky wraps around to black. So every point operation
must **saturate**: compute in a wider type, then pin the result into `0..255`.
Watch the contrast values in today's spec closely, because the middle one is the
interesting case: doubling the contrast of `128` gives `129`, not `128`. `128`
sits half a step above the `127.5` midpoint, doubling that half step gives a
whole one, and the rounding takes it up. It is a boundary worth pinning now,
because "roughly the middle grey stays put" is the kind of assumption that hides
an off-by-one for a very long time.
