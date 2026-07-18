---
project: build-an-stt-model
lesson: 6
title: Trimming silence
overview: Real recordings start and end with silence the recognizer should not waste effort on. Today you drop it by energy, from both ends only, and wire up an entry point - the project runs for the first time and prints a frame count.
goal: Drop the contiguous low-energy frames from each end of lesson 5's energies, and print how many survive.
spec:
  scenario: Trimming silent frames and running the pipeline
  status: failing
  lines:
    - kw: Given
      text: 'the 7 frame energies from lesson 5, and a silence threshold of 1% of the maximum energy across all 7 frames'
    - kw: When
      text: 'contiguous frames below that threshold are dropped from the start and from the end only - an interior frame is always kept, however low its own energy'
    - kw: Then
      text: 'the maximum energy is 1.7815069059, so the threshold is 0.0178150691'
    - kw: And
      text: 'frame 0 falls below the threshold and is dropped from the start'
    - kw: And
      text: 'frame 6 (energy 0.0007527200) also falls below the threshold and is dropped from the end'
    - kw: And
      text: 'frames 1 through 5 remain - 5 frames survive out of the original 7'
    - kw: When
      text: the whole pipeline runs on the synthesized signal from lesson 1
    - kw: Then
      text: 'it prints a frame count of 5'
code:
  lang: go
  source: |
    // walk in from the front while energy < ratio*max, then in from the back;
    // leave every interior frame alone no matter how quiet it is
    func TrimSilence(energies []float64, ratio float64) (first, last int) {
    	return 0, len(energies) - 1 // placeholder
    }
checkpoint: The pipeline runs end to end and prints 5 - the number of frames that survive silence trimming. Commit and stop for today.
---

Silence at the start and end of a recording carries no speech, so keeping it wastes
every later stage's effort on nothing. The rule is a **threshold** set relative to
the loudest frame - 1% of the maximum energy here - and then dropping frames below
it, but only **contiguously from each end**. An interior frame that happens to dip
quiet (a pause between two words, say) is never dropped, because trimming the
inside of an utterance would delete real content instead of the silence around it.

This is also the day the project becomes a program instead of a collection of
functions: wire up an entry point that synthesizes the signal, pre-emphasizes it,
frames it, windows each frame, measures its energy, trims the silent ends, and
prints how many frames are left. Everything from chapter 2 onward builds on top of
this same five-frame skeleton, so seeing `5` printed is the first real proof the
pipeline holds together.
