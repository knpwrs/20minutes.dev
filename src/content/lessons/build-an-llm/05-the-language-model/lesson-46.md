---
project: build-an-llm
lesson: 46
title: 'Capstone: train and generate'
overview: Every mechanism from lesson 1 onward now trains and generates from one entry point - train on the built-in repeating text, then watch the model continue the pattern it learned.
goal: Train the model on the built-in repeating text for 60 steps, then generate 10 characters from it, running the whole project end to end.
spec:
  scenario: Generating from the fully trained model
  status: failing
  lines:
    - kw: Given
      text: 'a fresh, identically pinned model (the same architecture built across this whole chapter), trained with full-batch SGD, lr=0.1, for 60 steps on the complete built-in training text "abcdabcdabcdabcd"'
    - kw: When
      text: 'the trained model greedily generates 10 characters, one at a time, starting from the seed context "abc"'
    - kw: Then
      text: 'the loss at step 0 is about 1.357327 and the loss at step 59 is about 0.018869'
    - kw: And
      text: 'the generated output - the seed plus its 10 generated characters - is "abcdabcdabcda", the model continuing the exact 4-character cycle it was trained on'
code:
  lang: go
  source: |
    // feed the model's own greedy pick back in as context, and repeat
    func Generate(m *LM, ids []int, n int) []int {
      for i := 0; i < n; i++ {
        probs := m.NextCharProbs(ids)    // lessons 39-40, last position
        ids = append(ids, Argmax(probs)) // lesson 43
      }
      return ids
    }
checkpoint: The whole machine now runs end to end - autograd, tensors, attention, a transformer block, cross-entropy, and SGD together train a real model that generates exactly the repeating pattern it was trained on, and no more. Commit and stop for today.
---

Every mechanism this project built now fires together on real data. The autograd engine from chapter 1 differentiates through embeddings, multi-head attention, layer normalization and the feed-forward network; chapter 2's own SGD loop, unchanged, pulls the mean loss on a 16-character training text from near the untrained `ln(4)` baseline down to `0.018869` in 60 steps. Feed the trained model its own greedy pick back in as the next character's context - lesson 43's move, repeated - and it produces `"abcdabcdabcda"`: the exact `"abcd"` cycle it was trained on, continued out past where the training text ended. That is the real, satisfying result this whole project has been built toward, and it is worth pausing on.

Be equally plain with yourself about what that result is not. The model did not learn to spell, and it did not learn English - it memorised a short repeating cycle, which is a genuinely easier problem, and it would produce this same kind of pattern completion on any short cycle you trained it on instead. A scalar-autograd transformer with under a thousand parameters, trained for well under a minute on one CPU core, learns to repeat a pattern; it has nowhere near the capacity or the data to learn a language. Scaling this same architecture to real text needs a tensor library standing in for individual `Value` nodes, and orders of magnitude more parameters, data and compute on top of that - and understanding exactly why that gap exists, from having built every piece on the near side of it yourself, is the honest note this project ends on.
