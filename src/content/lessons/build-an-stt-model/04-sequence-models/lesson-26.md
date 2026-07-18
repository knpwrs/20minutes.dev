---
project: build-an-stt-model
lesson: 26
title: A word as a state sequence
overview: A raw list of state indices is really a segmentation of the utterance into the word's parts. Today you read lesson 25's path as exactly that, and discover that Viterbi weighs the whole utterance rather than fitting each frame in isolation.
goal: Segment lesson 25's best state path into contiguous same-state runs and identify what each run represents.
spec:
  scenario: Reading a state path as a word's segmentation
  status: failing
  lines:
    - kw: Given
      text: 'lesson 25''s best state path [0, 0, 1, 1, 1, 1, 1] for the observation sequence [0.0, 0.1, 3.0, 3.2, 2.9, 0.2, 0.0], and the model''s 3 states: 0 silence-like (mean 0.0), 1 onset-like (mean 1.5), 2 steady-tone-like (mean 3.0)'
    - kw: When
      text: 'the path is grouped into contiguous runs of the same state'
    - kw: Then
      text: 'frames 0 and 1 are one run in state 0 - the silence at the start'
    - kw: And
      text: 'frames 2 through 6 are a single run in state 1 - even though frames 2, 3, and 4 (values 3.0, 3.2, 2.9) sit much closer to state 2''s mean of 3.0 than to state 1''s mean of 1.5'
    - kw: And
      text: 'state 2 is never visited at all, because advancing into it would strand the path there for the rest of the utterance (self-loop only, no way back), which would cost far more explaining the final low frames (0.2, 0.0) than staying in state 1 the whole time costs explaining the peak frames only tolerably'
code:
  lang: go
  source: |
    // group consecutive equal states into (state, startFrame, endFrame) runs
    type Run struct {
      State      int
      Start, End int // inclusive frame range
    }
    func Segments(path []int) []Run {
      // walk path, starting a new Run whenever path[t] != path[t-1]
      return nil
    }
checkpoint: You can read any Viterbi path as a segmentation of a word into its parts, and you have seen firsthand that the model optimizes the whole utterance, not each frame in isolation. Commit and stop for today.
---

A state path is really answering a question about time: which frames does the model believe were silence, which were the onset, and which were the steady part of the word? Grouping consecutive equal states into runs turns the raw list `[0, 0, 1, 1, 1, 1, 1]` into exactly that segmentation - two frames of silence, then five frames of one continuous sound.

That "one continuous sound" is the interesting part, because a frame-by-frame look at the data would have guessed differently: frames 2 through 4 are numerically much closer to state 2's mean than to state 1's. Viterbi does not fit each frame in isolation, though - it fits the whole path, and state 2 is a dead end with no way back to a lower state once entered. Committing to it for three good frames only to be stuck explaining the return to near-silence badly for the rest of the utterance costs more overall than never leaving state 1 in the first place. The path you get is the best explanation of everything, not the best label for any one frame.
