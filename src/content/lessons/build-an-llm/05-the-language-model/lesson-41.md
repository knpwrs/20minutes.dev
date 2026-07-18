---
project: build-an-llm
lesson: 41
title: The training loss over a sequence
overview: Sliding a 3-character window across the training text yields 13 labeled (context, next-character) examples. Scoring the model's prediction for one of them with lesson 25's cross-entropy gives the single number training will drive down.
goal: Compute the cross-entropy loss for one training example, using the logits and softmax built in the last two lessons.
spec:
  scenario: Cross-entropy loss for the first training example
  status: failing
  lines:
    - kw: Given
      text: 'sliding a 3-character window across "abcdabcdabcdabcd" left to right produces 13 (context, next-character) examples, consumed in order'
    - kw: And
      text: 'the first is x=[0, 1, 2] ("abc") giving y=3 ("d"); the second is x=[1, 2, 3] ("bcd") giving y=0 ("a"); the third is x=[2, 3, 0] ("cda") giving y=1 ("b")'
    - kw: And
      text: 'the probabilities from lesson 40 for the first example, about [0.220962, 0.257260, 0.260405, 0.261374]'
    - kw: When
      text: cross-entropy (lesson 25) is computed for the first example against its target class y=3
    - kw: Then
      text: 'the loss is about 1.341804'
code:
  lang: go
  source: |
    // slide a BlockSize-wide window across the training text, left to right
    for i := 0; i+blockSize < len(ids); i++ {
      ex := Example{X: ids[i : i+blockSize], Y: ids[i+blockSize]}
      examples = append(examples, ex)
    }
    // then: loss = CrossEntropyRow(lastRowProbs, ex.Y)
checkpoint: You can score any single training example with one real number, and you know exactly how many labeled examples this project's whole training text yields. Commit and stop for today.
---

The training text is 16 characters, and each example needs 3 characters of context plus 1 more to serve as the answer, so the last window that fits starts at index 12 - one past that and there is no answer character left to slide onto. That is why a 16-character text with a 3-character window yields exactly 13 examples, not 16: the count is `len(text) - BlockSize`, an edge worth checking against rather than assuming.

Today's single number - `1.341804` - is worth comparing against lesson 25's `ln(4) ≈ 1.386294`, the loss of a uniform guess over 4 classes. They are close but not equal, because the untrained output projection's weights are pinned, not zero, so the model's guess already leans very slightly away from uniform before a single gradient step has run.
