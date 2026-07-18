---
project: build-an-llm
lesson: 45
title: Top-k sampling
overview: Keeping only the k highest-probability characters, zeroing everything else, and renormalizing the survivors back to sum to 1 stops the model from ever picking a character it barely considered.
goal: Mask a probability distribution down to its top k entries, renormalize, and confirm the masked entries are exactly unreachable.
spec:
  scenario: Restricting sampling to the top 2 characters
  status: failing
  lines:
    - kw: Given
      text: 'the T=1.0 probabilities from lesson 43/44 for context "abc", about [0.001474, 0.115274, 0.003272, 0.879980], and k=2'
    - kw: When
      text: only the k highest probabilities are kept, the rest are set to exactly 0, and the kept values are rescaled so they sum to 1
    - kw: Then
      text: 'the result is about [0.000000, 0.115823, 0.000000, 0.884177]'
    - kw: And
      text: 'index 0 and index 2, the two masked classes, have probability exactly 0 - unreachable by any draw r in [0, 1)'
    - kw: And
      text: 'given r=0.05, walking the result in index order and picking the first index whose running cumulative sum exceeds r gives index 1, the character "b"'
code:
  lang: go
  source: |
    // keep the top k by value, zero the rest, then rescale kept values so
    // they sum back to 1
    func TopKMask(probs []float64, k int) []float64 {
      // sort indices by probability, descending; keep only the first k
      // sum ONLY the kept probabilities, then divide each kept value by
      // that sum - not by the original 1.0
      return make([]float64, len(probs))
    }
checkpoint: You can now cut sampling off at exactly k candidates and prove the rest are strictly unreachable, whatever r you are given. Commit and stop for today.
---

**Top-k** is a hard cutoff rather than temperature's gradual reshaping: rank the probabilities, keep only the k largest, and zero every other entry outright. Zeroing alone is not enough, though - the kept values no longer sum to 1 once the rest are gone, so the crucial second step is dividing each surviving value by the sum of *just the survivors*, not by the original total. Skip that renormalization and you have a vector of probabilities that no longer describes a valid distribution at all.

Today's numbers show why the cutoff is worth having on top of temperature: index 1 and index 3 already held nearly all the probability mass, so masking the other two barely changes their relative sizes, but it now makes them provably unreachable rather than merely unlikely - useful whenever a small, misplaced tail probability is a risk you would rather not take at all.
