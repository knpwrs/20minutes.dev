---
project: build-an-llm
lesson: 40
title: Predicting the next character
overview: Yesterday's logits are raw scores with no probabilistic meaning yet. Running lesson 24's softmax over the last position's row turns them into an actual probability distribution over the four possible next characters.
goal: Turn the model's logits at the last position into a probability distribution over the next character using lesson 24's softmax.
spec:
  scenario: Probability of the next character after "abc"
  status: failing
  lines:
    - kw: Given
      text: 'the logits at the last position from lesson 39, about [-0.117084, 0.035015, 0.047163, 0.050879]'
    - kw: When
      text: softmax (lesson 24) is applied to that row
    - kw: Then
      text: 'the result is about [0.220962, 0.257260, 0.260405, 0.261374]'
    - kw: And
      text: the four probabilities sum to 1
code:
  lang: go
  source: |
    // the model only ever needs to predict from the LAST position
    lastRow := logits.Data[len(tokens)-1]
    probs := SoftmaxRow(lastRow) // lesson 24
checkpoint: Every forward pass now ends in an actual next-character probability distribution, not just raw scores. Commit and stop for today.
---

Predicting is nothing more than running the model and reading its last row through softmax - a two-line composition of pieces you already have, chapter 4's block and chapter 3's softmax, aimed at the one position that matters for this window.

Notice how close today's four probabilities sit to `0.25` each. The output projection's weights are pinned but untrained, so the logits are all near zero and softmax has almost nothing to distinguish between the four characters - the model is, at this point, still guessing close to uniformly. That near-uniform starting point is exactly the baseline lesson 42's training will pull away from.
