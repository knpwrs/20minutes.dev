---
project: build-an-stt-model
lesson: 35
title: Collapsing repeats
overview: Repeated identical symbols in a per-frame output usually mean one event held across several frames. Today you merge them down to one, blanks included.
goal: Build a function that collapses consecutive identical symbols into one, and confirm it treats blanks exactly like any other symbol.
spec:
  scenario: Merging consecutive identical symbols
  status: failing
  lines:
    - kw: Given
      text: 'lesson 34''s 6-frame raw sequence A, A, -, A, A, B'
    - kw: When
      text: 'consecutive identical symbols are merged into one, blanks included'
    - kw: Then
      text: 'the collapsed sequence is exactly A, -, A, B - both pairs of repeated A frames have shrunk to a single A each, and the blank between them survived untouched'
    - kw: And
      text: 'given a second raw sequence A, -, -, B, with two consecutive blank frames, collapsing merges them into one blank too, giving A, -, B - a blank is an ordinary symbol to this rule, never special-cased'
code:
  lang: go
  source: |
    // walk the sequence once, only keeping a symbol when it differs from
    // whatever was just appended - this applies to blanks exactly like it
    // does to letters
    func CollapseRepeats(seq []string) []string {
      out := []string{seq[0]}
      return out
    }
checkpoint: Repeats collapse to one occurrence each, blanks included, and you have not yet touched blank removal - that is a separate step lesson 36 needs kept separate. Commit and stop for today.
---

Collapsing repeats answers a narrow question: given a run of identical symbols back to back, treat it as one event rather than several. A frame-by-frame model is expected to hold its output steady for as long as a letter (or a stretch of silence) actually lasts, so seeing the same symbol several frames running is the ordinary case, not an anomaly - collapsing simply undoes that repetition.

The detail worth pinning today is that this rule makes no exception for the blank. `A, A, -, A, A, B` collapses to `A, -, A, B`: each pair of `A` frames shrinks to one `A`, and the single blank between them, having no neighbour identical to itself, survives untouched. But a run of *repeated* blanks collapses exactly the same way a run of repeated letters would - `A, -, -, B` becomes `A, -, B`. Keeping this step blind to what a blank means is what makes lesson 36 able to compose it safely with a separate blank-removal step, in either order, and see the two orders disagree.
