---
project: build-an-stt-model
lesson: 9
title: The mel scale
overview: Human pitch perception is not linear in Hz - equal steps sound equally different only on a warped scale. Today you pin the exact formula for that warp, because a close-but-different version quietly changes every value downstream.
goal: Implement the mel-scale formula and confirm it against three pinned frequencies.
spec:
  scenario: Converting Hz to mel
  status: failing
  lines:
    - kw: Given
      text: 'the mel-scale formula mel(f) = 2595 times the base-10 logarithm of (1 + f/700)'
    - kw: When
      text: 'mel is computed for f = 0, f = 1000, and f = 4000 (the Nyquist frequency at this project''s 8000 Hz sample rate)'
    - kw: Then
      text: 'mel(0) is exactly 0'
    - kw: And
      text: 'mel(1000) is approximately 999.9855371396'
    - kw: And
      text: 'mel(4000) is approximately 2146.0645275062 - quadrupling the frequency barely more than doubles the mel value, which is exactly the compression the scale exists to model'
code:
  lang: go
  source: |
    // mel(f) = 2595 * log10(1 + f/700) - base-10 log, not natural log
    func MelFromHz(f float64) float64 {
      return 2595 * math.Log10(1+f/700)
    }
checkpoint: You have the exact perceptual scale every mel filter in the next two lessons is built from. Commit and stop for today.
---

Doubling a low frequency (say `100 Hz` to `200 Hz`) is an obvious pitch jump; doubling a high one (`4000 Hz` to `8000 Hz`) is barely noticeable. The **mel scale** is a frequency axis re-shaped so that equal distances on it sound like equal distances to a human ear, compressing the high end the way hearing already does. Every filter from lesson 10 onward is built by spacing points evenly in mel, not in Hz, which is what gives the filterbank narrow filters at low frequencies and wide ones at high frequencies.

The formula has to be pinned exactly, because the literature is full of near-identical variants that are not actually the same function: `1127*ln(1+f/700)` gives `999.9907` at `1000 Hz`, close to today's `999.9855` but not identical, since `1127` is only a rounded stand-in for `2595/ln(10)`. Swap the base-10 log for a natural log while keeping the `2595` constant and you get `2302.55` - wildly wrong, not a rounding difference. This project uses `2595*log10(1+f/700)`, full stop, because every value in the rest of this chapter is computed against it.
