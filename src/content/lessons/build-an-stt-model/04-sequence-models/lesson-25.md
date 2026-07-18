---
project: build-an-stt-model
lesson: 25
title: 'Viterbi: backtracking'
overview: The trellis's final score tells you how good the best path was, but not what that path actually did frame by frame. Today you recover it, by recording each cell's winning predecessor while filling the trellis and then walking those pointers back.
goal: Reconstruct the complete best state path for all 7 frames by recording back-pointers while filling lesson 23's trellis and walking them backward from the winning final state.
spec:
  scenario: Recovering the complete best state path
  status: failing
  lines:
    - kw: Given
      text: 'lesson 23''s trellis recurrence, extended to also record, in Back[t][s], whichever predecessor state produced LogScore[t][s]'
    - kw: And
      text: 'the pinned tie-break rule, needed whenever two predecessors would produce exactly the same score: the lowest-indexed state wins - both when recording a predecessor while filling the trellis, and when choosing among tied states in the final frame'
    - kw: When
      text: 'the best final state is chosen (lesson 24''s state 1, log-score -15.2088830834) and the back-pointers are followed backward from frame 6 to frame 0'
    - kw: Then
      text: 'the complete best state path, one state per frame from t=0 to t=6, is exactly [0, 0, 1, 1, 1, 1, 1]'
    - kw: And
      text: 'the path never skips a state or moves backward - it starts in state 0, stays there one extra frame, then advances into state 1 and stays there for the rest of the utterance'
code:
  lang: go
  source: |
    // start at the best final state, then repeatedly step to Back[t][state]
    // and move one frame earlier, until frame 0 is reached
    // name it ViterbiBacktrack, not Backtrack - lesson 16's DTW already has a
    // Backtrack, and two functions can't share a name in one package
    func ViterbiBacktrack(back [][]int, bestFinal int) []int {
      path := make([]int, len(back))
      path[len(path)-1] = bestFinal
      // walk backward: path[t-1] = back[t][path[t]]
      return path
    }
checkpoint: You can recover not just the best score but the exact sequence of states that earned it - the answer this whole chapter has been building toward. Commit and stop for today.
---

A score by itself does not tell a story - `-15.2088830834` says nothing about when the model thinks the word's onset started or how long it lingered in each part. Recovering that story only needs one more piece of bookkeeping alongside the trellis: whenever a cell's value is decided by comparing "stayed" against "advanced", remember which of the two actually won. That single predecessor per cell is enough, because walking backward one link at a time - from the best final state all the way to frame 0 - retraces exactly the path the forward pass already found to be best.

The tie-break rule exists for the same reason it did in lesson 17's DTW path: two predecessors landing on the exact same score is possible in principle, and without a fixed way to choose between them, "the" best path stops being a well-defined thing. Today's utterance never actually lands on one of those ties, but the rule still has to be pinned - state paths are exact sequences of integers, and a different rule is free to disagree with this one wherever a tie genuinely appears.
