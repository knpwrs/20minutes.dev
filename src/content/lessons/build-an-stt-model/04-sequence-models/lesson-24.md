---
project: build-an-stt-model
lesson: 24
title: 'Viterbi: the forward pass'
overview: The trellis's final frame holds the best score of any path through the utterance - but only because it lives in the log domain. Today you read off that score, and see the exact frame where a plain-probability version would already have failed.
goal: Read off the best final log-score from lesson 23's trellis, and confirm with real numbers why that trellis has to live in the log domain at all.
spec:
  scenario: Reading the best score and confirming why it must be a log-score
  status: failing
  lines:
    - kw: Given
      text: 'lesson 23''s completed trellis, whose final frame holds log-scores approximately -31.858883, -15.208883, and -20.236294 for states 0, 1, and 2'
    - kw: When
      text: 'the best final log-score is read off as the largest of the three'
    - kw: Then
      text: 'the best final log-score is -15.2088830834, in state 1'
    - kw: Given
      text: 'a representative per-frame probability factor of about 0.1839397206 (roughly exp(-1) times 0.5) - the kind of factor a plain-probability version of this same recurrence would multiply in at every single frame, instead of adding a log-score'
    - kw: When
      text: 'that factor is instead repeatedly multiplied as a plain float64 probability, one frame after another, starting from 1.0'
    - kw: Then
      text: 'the running product hits exactly 0.0 at frame 441 - a completely ordinary utterance length - with its last nonzero value, at frame 440, already down to about 4.940656e-324, float64''s smallest subnormal number'
    - kw: And
      text: 'the equivalent log-domain sum at that same frame 441 is approximately -746.677907 - a large negative number, but a perfectly finite one'
code:
  lang: go
  source: |
    // multiply a fixed factor into a product each frame; return the frame
    // count where the product first becomes exactly 0.0
    func UnderflowFrame(factor float64, maxFrames int) int {
      prod := 1.0
      for t := 1; t <= maxFrames; t++ {
        prod *= factor // check for exactly 0.0 here, return t if so
      }
      return -1
    }
checkpoint: You can find Viterbi's best final score, and you have seen, in exact numbers, why every score in this chapter has to live in the log domain rather than as a plain probability. Commit and stop for today.
---

Finding the single best score the whole model produced is now the easy part: scan the final frame's three cells and take the largest, since every cell already represents the best path ending there. What deserves the real attention today is *why* that number - a plain-looking `-15.2` - is trustworthy at all, when the process that produced it involved multiplying dozens of small factors together at every frame.

Run that same accumulation as ordinary probabilities instead of log-scores, and it does not creep slowly toward zero - it goes there exactly, in float64, at frame 441. That is not an edge case reserved for unusually long recordings; 441 frames at this project's 4ms hop is under two seconds of audio. The log-domain sum at that identical point is still a perfectly ordinary finite number, which is the entire justification for a decision this chapter made all the way back in lesson 22 and never looked back from.
