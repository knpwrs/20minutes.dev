---
project: build-an-stt-model
lesson: 3
title: Framing the signal
overview: A speech signal changes character too fast to analyze as one long block and too slowly to treat one sample at a time. Today you cut it into fixed, overlapping frames - the unit every later chapter analyzes one at a time.
goal: Cut the pre-emphasized signal into 64-sample frames with a 32-sample hop, with no padding.
spec:
  scenario: Framing the pre-emphasized signal
  status: failing
  lines:
    - kw: Given
      text: 'the 256-sample pre-emphasized signal from lesson 2, a frame length of 64 samples (8 ms at 8000 Hz), and a hop of 32 samples (4 ms)'
    - kw: When
      text: 'the signal is cut into frames, using numFrames = 1 + floor((256 minus 64) divided by 32), with no padding and any leftover samples that do not fill a full frame simply dropped'
    - kw: Then
      text: 'there are exactly 7 frames'
    - kw: And
      text: 'frame 0 covers samples 0 up to (not including) 64'
    - kw: And
      text: 'frame 1 covers samples 32 up to 96 - overlapping the second half of frame 0'
    - kw: And
      text: 'frame 6 covers samples 192 up to 256 - the last frame, using every remaining sample exactly with none left over to drop'
code:
  lang: go
  source: |
    // numFrames = 1 + (numSamples-frameLen)/hop, using integer division (which floors)
    func FrameCount(numSamples, frameLen, hop int) int {
    	return 1 + (numSamples-frameLen)/hop
    }
    // frame i starts at i*hop and runs for frameLen samples
checkpoint: The signal is cut into overlapping frames, and you have a rule for how many there are. Commit and stop for today.
---

Speech is not stationary: its frequency content shifts many times a second, so
transforming the whole 256-sample signal at once (coming in chapter 2) would blur
together sounds that do not belong together. The fix is to cut the signal into
short **frames** - here `64` samples, `8 ms` - short enough that the content
inside one frame is roughly steady. Frames also **overlap**: each new frame starts
only `32` samples (a `hop` of `4 ms`) after the last one, so no moment in the
signal falls at a frame's ragged edge in every frame simultaneously.

The frame count follows one rule, with no exceptions: `numFrames = 1 +
floor((numSamples - frameLen) / hop)`, and any samples left over after the last
full frame are simply dropped rather than padded. Today's numbers happen to use
every one of the 256 samples exactly, so nothing is actually dropped here - but the
rule has to floor and discard on its own, because the next signal you frame will
not divide so cleanly.
