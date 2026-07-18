---
project: build-an-stt-model
lesson: 21
title: States and transitions
overview: A DTW template assumes a word is spoken one fixed way; a hidden Markov model instead breaks a word into states a frame can dwell in or advance past. Today you build that model's skeleton.
goal: Define a 3-state left-to-right word model with pinned self-loop and advance probabilities and pinned per-state emission means.
spec:
  scenario: Defining a left-to-right state model
  status: failing
  lines:
    - kw: Given
      text: 'a 3-state left-to-right word model - state 0 (silence-like), state 1 (onset-like), and state 2 (steady-tone-like) - each carrying a pinned mean feature value used later for scoring: 0.0, 1.5, and 3.0'
    - kw: And
      text: 'the pinned transition rule: states 0 and 1 may either self-loop (stay put for the next frame) or advance to the next state, each with probability 0.5; state 2, the last, may only self-loop, with probability 1.0 and no advance transition at all'
    - kw: When
      text: 'the model''s transition probabilities are inspected'
    - kw: Then
      text: 'state 0''s self-loop probability is 0.5 and its advance probability is 0.5'
    - kw: And
      text: 'state 1''s self-loop probability is 0.5 and its advance probability is 0.5'
    - kw: And
      text: 'state 2''s self-loop probability is 1.0, and it has no advance transition - there is nowhere left for it to go'
code:
  lang: go
  source: |
    // left-to-right: every state may self-loop; every state but the last may
    // also advance to the next one, splitting probability 0.5/0.5
    type HMM struct {
      Means    []float64
      SelfLoop []float64
      Advance  []float64 // last state has no advance transition
    }
checkpoint: You have the skeleton every later lesson in this chapter scores paths against - a small graph of states that only ever stays put or moves forward. Commit and stop for today.
---

DTW compares a whole test sequence against a whole template at once, which works only as long as the template's shape does not vary too much from utterance to utterance. A **hidden Markov model** takes a different approach: break the word into a handful of states - here, silence, onset, and steady tone - and let each frame decide for itself whether to stay in the current state or move on to the next one. Nothing skips ahead and nothing goes backward, which is what "left-to-right" means: state 1 can only ever be reached from state 0 or from itself, never from state 2.

The two transitions out of a non-final state split probability evenly, and the final state simply loops on itself forever once reached, because there is no state after it to advance into. These numbers - not yet combined with anything about the actual sound of a frame - are the whole graph structure the rest of this chapter runs a search over: lesson 22 adds what a frame's own features contribute, and lesson 23 onward is about finding the best path through this graph given both.
