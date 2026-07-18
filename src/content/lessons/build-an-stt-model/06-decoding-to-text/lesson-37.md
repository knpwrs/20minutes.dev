---
project: build-an-stt-model
lesson: 37
title: Beam search
overview: Greedy decoding commits to one path per frame and never looks back. Today you track several candidate decodings at once and prune them deterministically down to a fixed width.
goal: Run CTC prefix beam search with width 2 over 4 pinned frames of symbol probabilities, and confirm the surviving prefixes and their probabilities.
spec:
  scenario: Beam search over pinned per-frame probabilities
  status: failing
  lines:
    - kw: Given
      text: 'the 3-symbol alphabet blank, A, B, and 4 frames of pinned per-frame probabilities ordered [blank, A, B]: frame 0 is [0.6, 0.3, 0.1], frame 1 is [0.4, 0.4, 0.2], frame 2 is [0.3, 0.2, 0.5], and frame 3 is [0.6, 0.1, 0.3], each row summing to 1.0'
    - kw: And
      text: 'a beam width of 2, keeping only the top 2 prefixes after each frame by total probability (the sum of the probability mass ending in blank and the mass ending in a real symbol), with ties broken by whichever prefix is lexicographically smaller'
    - kw: When
      text: beam search runs after frame 0 alone
    - kw: Then
      text: 'the two surviving prefixes are the empty prefix, with total probability 0.6, and the single-letter prefix "A", with total probability 0.3 - the single-letter "B" prefix, at 0.1, is pruned away'
    - kw: When
      text: beam search instead runs across all 4 frames
    - kw: Then
      text: 'the top surviving prefix is "AB", with a total probability of approximately 0.29520000, split as 0.14400000 ending in blank and 0.15120000 ending in a real symbol'
    - kw: And
      text: 'the second surviving prefix is "A" alone, with a total probability of approximately 0.17040000'
code:
  lang: go
  source: |
    // track each prefix's probability mass in two parts: ending in blank
    // (PBlank) and ending in a real symbol (PNonBlank); total is their sum
    type BeamEntry struct {
      Prefix             []string
      PBlank, PNonBlank  float64
    }
    // after each frame, keep only the top `width` entries by total probability
checkpoint: You can track more than one decoding hypothesis at once and prune deterministically, which recovers a better answer than greedy decoding would in cases where the single best per-frame path is not actually the best overall decoding. Commit and stop for today.
---

Greedy decoding commits to the single most likely symbol every frame and never reconsiders, which can throw away a perfectly good alternative that would have scored better once a few more frames' evidence came in. **Beam search** instead keeps several candidate decoded prefixes alive at once, updates every one of them with each new frame's probabilities, and only prunes back down to a fixed width once the frame is finished.

Each surviving prefix tracks two separate pools of probability mass - alignments that happen to end in a blank right now, and alignments that end in a real symbol - because a blank or a repeated letter arriving next behaves differently depending on which pool it followed. Total probability, the sum of the two, is what pruning ranks by; when two prefixes are exactly tied, a fixed rule - the lexicographically smaller string wins - keeps the result reproducible, the same reason lesson 17's DTW path needed a pinned tie-break, even on data where the tie never actually happens to occur.
