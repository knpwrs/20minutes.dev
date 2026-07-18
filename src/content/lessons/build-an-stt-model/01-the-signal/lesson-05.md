---
project: build-an-stt-model
lesson: 5
title: Energy per frame
overview: Not every frame carries speech - long stretches at the start and end of a recording are pure silence, and today's measure is what will tell them apart in the next lesson. Energy is the simplest number that separates quiet from loud.
goal: Compute each of the 7 windowed frames' energy as the sum of its squared samples.
spec:
  scenario: Measuring frame energy
  status: failing
  lines:
    - kw: Given
      text: 'the 7 windowed frames from lesson 4'
    - kw: When
      text: 'each frame''s energy is computed as the sum of the squares of its samples'
    - kw: Then
      text: 'frame 0 - pure silence throughout - has energy less than 1e-9'
    - kw: And
      text: 'frame 1 has energy 0.8233038336'
    - kw: And
      text: 'frame 2 has energy 1.7807541859'
    - kw: And
      text: 'frame 6 has energy 0.0007527200 - small but not silent, because pre-emphasis (lesson 2) leaves a trace of the tone bleeding across the boundary into the otherwise-silent last frame'
code:
  lang: go
  source: |
    // sum of squares - no normalizing by frame length, no log yet
    func FrameEnergy(frame []float64) float64 {
    	e := 0.0
    	for _, v := range frame {
    		e += v * v
    	}
    	return e
    }
checkpoint: Every frame now has a single number describing how loud it is. Commit and stop for today.
---

**Energy** is the sum of a frame's squared samples - no averaging, no decibels,
just a number that grows with how much the signal is moving. It is deliberately
the simplest loudness measure available, and it is enough: a silent frame's
samples are all near zero, so its energy is near zero too, while a frame sitting
inside the tone has samples that swing widely and an energy to match.

Watch frame 6 closely. It covers samples `192` to `256`, which by the original
formula in lesson 1 is pure trailing silence - and yet its energy is not the
near-zero of frame 0. Pre-emphasis subtracts a fraction of each sample from its
successor, so the very first sample after the tone ends still carries a scaled-down
echo of the tone's last value. That echo is small, but real, and it is exactly the
kind of near-silence the next lesson has to draw a threshold through rather than
assuming is exactly zero.
