---
project: build-an-stt-model
lesson: 34
title: The blank symbol
overview: A model emitting one symbol per frame has no way to say "nothing new happened here" without a symbol that means exactly that. Today you add it - the blank.
goal: Extend a two-letter alphabet with a blank symbol and confirm the pinned 6-frame example the rest of this chapter decodes.
spec:
  scenario: Defining the blank symbol
  status: failing
  lines:
    - kw: Given
      text: 'the two-letter alphabet A and B, extended with a third symbol - the blank, written as "-" - meaning "no letter is emitted this frame", so the full emitting alphabet has size 3'
    - kw: And
      text: 'a model emits exactly one symbol from that 3-symbol alphabet per frame, and the pinned 6-frame example this chapter uses throughout is exactly A, A, -, A, A, B'
    - kw: When
      text: the example sequence is inspected
    - kw: Then
      text: 'it has length 6, one symbol per frame'
    - kw: And
      text: 'the blank appears exactly once, at frame index 2 (0-indexed), sitting between the first pair of A frames and the second'
    - kw: And
      text: 'removing that blank alone, before doing anything else to the sequence, would leave four A frames in a row with no way left to tell whether they came from one long letter or two short ones - lesson 35 depends on that information still being there'
code:
  lang: go
  source: |
    // the blank is just another value the alphabet can hold - nothing
    // special about its type, only about what it means
    const Blank = "-"
    var Alphabet = []string{Blank, "A", "B"}
    var RawSequence = []string{"A", "A", Blank, "A", "A", "B"}
checkpoint: The alphabet now includes a blank alongside the real letters, and you have the pinned 6-frame example the next three lessons decode. Commit and stop for today.
---

A model that must emit exactly one symbol per frame runs into a problem the moment a single letter takes more than one frame to say: it has no way to signal "I am still saying the same letter" versus "I have moved on to a new occurrence of it." The **blank** symbol exists to solve exactly that - a third value in the alphabet that means "no letter is being emitted this frame," sitting alongside the real letters rather than replacing any of them.

Today's pinned example, `A, A, -, A, A, B`, is the one lesson 35 and lesson 36 both decode, so it is worth reading closely now. The blank at position 2 is doing real work: it separates two pairs of `A` frames that would otherwise run together into one indistinguishable block. Nothing about that separation is used yet - today only defines the symbol and the example - but every later lesson in this chapter depends on that blank still being present when it is needed.
