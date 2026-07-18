---
project: build-an-stt-model
lesson: 23
title: The trellis
overview: A single frame's emission scores only say which state fits best right now. Today you stitch every frame's scores together into one cumulative table - the trellis - so the model can weigh an entire utterance at once.
goal: Build the trellis of cumulative log-scores for all 7 frames of lesson 22's observation sequence.
spec:
  scenario: Filling the cumulative log-score table
  status: failing
  lines:
    - kw: Given
      text: 'lesson 21''s 3-state model and lesson 22''s emission log-scores for all 7 frames of the observation sequence [0.0, 0.1, 3.0, 3.2, 2.9, 0.2, 0.0]'
    - kw: And
      text: 'the model always starts in state 0 at frame 0, so LogScore[0] is [0.0, negative infinity, negative infinity] - states 1 and 2 are simply unreachable before any frame has advanced into them'
    - kw: And
      text: 'for every later frame t, LogScore[t][s] is frame t''s emission log-score for s, plus whichever is larger: staying in s (LogScore[t-1][s] plus log(0.5)), or advancing into s from s-1 (LogScore[t-1][s-1] plus log(0.5)) - state 0 has no advance path in, and state 2 has no advance path out'
    - kw: When
      text: 'the trellis is filled in, frame by frame, for all 7 frames'
    - kw: Then
      text: 'LogScore[1] is approximately [-0.703147, -2.653147, negative infinity]'
    - kw: And
      text: 'LogScore[3] is approximately [-21.329442, -7.229442, -3.386294]'
    - kw: And
      text: 'LogScore[6], the final frame, is approximately [-31.858883, -15.208883, -20.236294]'
code:
  lang: go
  source: |
    // LogScore[t][s] = emission(s, obs[t]) + max(stay-in-s, advance-into-s).
    // Read each transition log-prob from the HMM per state - do NOT hardcode
    // log(0.5) everywhere: lesson 21 gave the last state a free self-loop
    // (log-prob 0), so its stay-cost differs from the others.
    // state 0 at t>0 can only be reached by staying; unreachable states hold -Inf
    func FillTrellis(h HMM, obs []float64) [][]float64 {
      score := make([][]float64, len(obs))
      // score[0][0] = h.EmissionLogScore(0, obs[0]); the other two states are -Inf
      // for t>0 and each state s, take the max of the two candidate paths in
      return score
    }
checkpoint: You have the full cumulative log-score table behind Viterbi - one cell per state per frame, each holding the best score of any path reaching it. Commit and stop for today.
---

A **trellis** is just a grid with one cell per state per frame, and each cell answers a bigger question than lesson 22's emission score alone could: not "how well does this frame fit this state", but "what is the best possible cumulative score of any path that ends up in this state after this many frames." Building that grid one frame at a time is what makes chapter 4's whole approach tractable - rather than considering every possible sequence of states directly, which grows exponentially with the number of frames, each cell only ever needs to look at the handful of cells one frame back.

Every cell's value is the same recipe: today's own emission log-score, plus whichever of the two ways of arriving here scored better - having stayed in this state, or having just advanced into it. Because both the transition and the emission contributions are log-scores, "better" always just means "larger", and combining two steps of a path is always addition, never multiplication - exactly the log-domain discipline lesson 22 introduced.
