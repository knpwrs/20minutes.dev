---
project: build-an-stt-model
lesson: 27
title: Connecting words into a grammar
overview: One word's model is a closed loop with no exit once it reaches its last state. Chaining models end to end - one word's last state advancing into the next word's first - turns isolated-word recognition into continuous recognition.
goal: Concatenate two 3-state word models into one 6-state grammar and run Viterbi over a 12-frame observation spanning both words.
spec:
  scenario: Running Viterbi over two concatenated word models
  status: failing
  lines:
    - kw: Given
      text: 'two word models chained into one 6-state left-to-right model: states 0, 1, 2 are word 1 (silence mean 0.0, onset mean 1.5, tone mean 3.0) and states 3, 4, 5 are word 2 (silence mean 0.0, onset mean 1.5, tone mean 4.0), with state 2 advancing into state 3 exactly like any other state advances into its successor'
    - kw: And
      text: 'the 12-frame observation sequence [0.0, 0.1, 3.0, 3.2, 2.9, 0.2, 0.0, 0.1, 1.6, 4.0, 4.2, 3.9], spanning both words back to back'
    - kw: When
      text: 'Viterbi is run over the full 6-state, 12-frame grammar'
    - kw: Then
      text: 'the best state path is exactly [0, 1, 2, 2, 2, 3, 3, 3, 4, 5, 5, 5] - every one of the 6 states is visited at least once'
    - kw: And
      text: 'the best log-score is -8.3583246250'
    - kw: And
      text: 'word 1 occupies frames 0 through 4 and word 2 occupies frames 5 through 11 - the boundary falls between state 2''s last frame and state 3''s first'
code:
  lang: go
  source: |
    // concatenate two HMMs: the last state of word 1 gets an advance
    // transition into the first state of word 2, exactly like any other
    // state boundary - the combined means are just both words' means in order
    func Concatenate(a, b HMM) HMM {
      means := append(append([]float64{}, a.Means...), b.Means...)
      return NewHMM(means)
    }
checkpoint: You can chain any two word models into one larger grammar and let Viterbi find the best segmentation and score across all of them at once - the last idea this chapter needs before chapter 5 trains the emission means these lessons have had to assume. Commit and stop for today.
---

Every word model built so far ends in a state with nowhere left to go, which is fine for recognizing one isolated word but useless for a sentence. A **grammar** fixes that by chaining models together: word 1's last state gets exactly the same kind of advance transition every other state already has, except its destination is word 2's first state instead of one of its own. Nothing about the recurrence changes - a 6-state grammar is scored by the exact same forward pass and backtracking as a 3-state word, just over more states and more frames.

Today's example is built so every state actually gets to prove itself - unlike lesson 26's shorter example, this one's frames genuinely fit each of the 6 states best in turn, so the recovered path visits all of them and the boundary between the two words falls out naturally, right where state 2 hands off to state 3. That segmentation - which frames belonged to which word - is the beginning of continuous recognition: a search over one connected graph instead of a separate DTW or Viterbi run per candidate word.
