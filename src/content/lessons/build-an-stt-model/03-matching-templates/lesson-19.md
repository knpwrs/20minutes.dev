---
project: build-an-stt-model
lesson: 19
title: Cepstral mean normalization
overview: Every frame of one recording shares the same microphone and channel bias, and that constant offset can swamp the real differences DTW is trying to measure. Today you remove it by subtracting each coefficient's average across the whole utterance.
goal: Compute cepstral mean normalization over the pipeline's 7 frames and confirm the normalized vectors for two of them.
spec:
  scenario: Removing the per-coefficient mean across an utterance
  status: failing
  lines:
    - kw: Given
      text: 'the mean MFCC vector across all 7 of the pipeline''s frames (lesson 14''s 6-coefficient pipeline, run once per frame rather than only on frame 2), pinned as [-29.95056502, -0.49948974, -7.65608412, -0.71470187, 3.15468264, -0.00372251]'
    - kw: And
      text: 'frame 0''s own MFCC vector, [-65.12694134, -0.00000000, 0.00000000, -0.00000000, -0.00000000, 0.00000000], and frame 2''s own MFCC vector, [-22.79679711, -1.69008203, -8.79334467, -0.41782677, 6.71919526, 0.21964936] - frame 2''s is unchanged from lesson 14'
    - kw: When
      text: 'the mean vector is subtracted, coefficient by coefficient, from frame 0''s and frame 2''s vectors'
    - kw: Then
      text: 'frame 0''s normalized vector is [-35.17637632, 0.49948974, 7.65608412, 0.71470187, -3.15468264, 0.00372251]'
    - kw: And
      text: 'frame 2''s normalized vector is [7.15376791, -1.19059229, -1.13726055, 0.29687510, 3.56451262, 0.22337187]'
    - kw: And
      text: 'summing every one of the 7 frames'' normalized vectors, coefficient by coefficient, gives (approximately) zero in every coefficient - subtracting a mean always cancels itself out once averaged back over the same frames it came from'
code:
  lang: go
  source: |
    // two passes over the frames: first average each coefficient across all
    // of them, then subtract that per-coefficient mean from every frame
    func CepstralMeanNormalize(mfccs [][]float64) [][]float64 {
      out := make([][]float64, len(mfccs))
      // fill out[t][d] = mfccs[t][d] - mean[d], using a mean you compute first
      return out
    }
checkpoint: Every frame's MFCC vector has had the recording's constant bias removed, which is what lets DTW compare two recordings without being thrown off by a different microphone or gain. Commit and stop for today.
---

A microphone's gain, the distance to a speaker's mouth, or the channel a recording passed through all add a roughly constant offset to every coefficient of every frame - the same offset whether the frame is silence or the loudest part of the word. That offset says nothing about what was said, yet lesson 15's distance would happily count it as a difference between two recordings of the exact same word. **Cepstral mean normalization** removes it in the most direct way possible: average each coefficient over the whole utterance, then subtract that average from every frame.

Notice what happens to frame 0 in particular - a near-silent frame whose raw first coefficient sits around `-65`, far below every other frame's, gets pulled back toward the pack once the (also quite negative) mean is subtracted out. That is the entire point: two recordings of the same word made on different microphones can have wildly different absolute levels while still having the same *shape* of variation from frame to frame, and it is that shape - not the absolute level - that identifies the word.
