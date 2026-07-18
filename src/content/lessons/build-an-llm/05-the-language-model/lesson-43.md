---
project: build-an-llm
lesson: 43
title: Greedy sampling
overview: The trained model's logits for a context are numbers, not a decision. Greedily picking the index with the largest probability - the argmax - is the simplest, fully deterministic way to turn them into a chosen next character.
goal: Generate the single most likely next character for context "abc" by taking the argmax of the trained model's output distribution.
spec:
  scenario: Greedily choosing the next character after "abc"
  status: failing
  lines:
    - kw: Given
      text: 'the model trained in lesson 42 (after 30 steps), and context "abc"'
    - kw: When
      text: the model computes logits for the next position, softmax turns them into probabilities, and greedy sampling picks the index of the largest probability
    - kw: Then
      text: 'the logits are about [-3.001700, 1.357427, -2.204565, 3.390018]'
    - kw: And
      text: 'the probabilities are about [0.001474, 0.115274, 0.003272, 0.879980]'
    - kw: And
      text: 'the chosen index is 3, the character "d"'
code:
  lang: go
  source: |
    // argmax: index of the largest value; ties keep the first occurrence
    func Argmax(probs []float64) int {
      best := 0
      for i, p := range probs {
        if p > probs[best] {
          best = i
        }
      }
      return best
    }
checkpoint: The trained model can now choose a next character deterministically - the same context always produces the same choice. Commit and stop for today.
---

**Greedy sampling** is the simplest possible policy: run the model, softmax the logits, and take whichever index holds the largest probability. There is no randomness anywhere in it - the same context fed into the same trained weights always produces the same character, which makes it the easiest policy to test and the one every other sampling strategy in this chapter gets compared against.

Look at the size of the gap in today's probabilities: `0.879980` on index 3 against a few thousandths on indices 0 and 2. Thirty steps of training have pushed the model to be genuinely confident that `"abc"` is followed by `"d"` - the correct continuation of the `"abcd"` cycle it was trained on - and greedy sampling simply takes that confidence at face value.
