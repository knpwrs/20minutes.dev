---
project: build-a-tts-model
lesson: 34
title: 'A table of durations'
overview: 'Chapter 6 replaces the hand-tuned duration rule with a model fit to data - but that data has to exist first. Today you front-load six INVENTED rows, not real measured speech, and say so plainly.'
goal: 'Build a fixed, six-row dataset mapping (stressed, phrase-final) to a duration in milliseconds, in a fixed order.'
spec:
  scenario: 'Inspecting the fixed duration dataset'
  status: failing
  lines:
    - kw: Given
      text: 'six rows, in this exact fixed order - (stressed=0, final=0) to 120 ms; (1,0) to 150 ms; (0,1) to 160 ms; (1,1) to 200 ms; (0,0) to 110 ms; (1,0) to 160 ms'
    - kw: When
      text: 'the dataset is inspected'
    - kw: Then
      text: 'it holds exactly 6 rows, in that exact order - order matters, since chapter 6''s training later walks this list with no shuffling'
    - kw: And
      text: 'rows 0 and 4 share the same features (0,0) but disagree on duration - 120 ms versus 110 ms - and rows 1 and 5 share (1,0) but disagree too - 150 ms versus 160 ms: real disagreement a lookup table cannot resolve, which is exactly why a fitted model earns a place here'
    - kw: And
      text: 'these six numbers are invented for this project, not measurements of real recorded speech - say so plainly, since every later result in this chapter is only as honest as this admission'
code:
  lang: go
  source: |
    type DurationExample struct {
      Stressed, PhraseFinal float64 // each 0 or 1
      DurationMs            float64
    }
    // six rows, fixed order - the exact sequence chapter 6's training later walks
checkpoint: 'A small, honestly-labeled dataset now exists for chapter 6 to fit a model against, in a fixed order that later training depends on. Commit and stop for today.'
---

Chapters 4 and 5 built a synthesizer entirely from hand-written rules - a
duration table, a stress multiplier, a final-lengthening factor, all chosen
by hand. Chapter 6 asks a different question: what if a duration model were
**fit to data** instead of written by hand? Fitting anything needs data to
fit, so today's job is only to build that data - six rows, each pairing
whether a vowel is stressed and whether it is phrase-final with a duration
in milliseconds.

Be honest about what this table is: six **invented** numbers, chosen to look
plausible, not measurements pulled from real recorded speech. Two pairs of
rows even share identical features but disagree on duration - real variation
no simple table lookup can capture - which is exactly the situation a fitted
model is built to handle. Keep the rows in this fixed order, too: nothing
later in this chapter shuffles them, and the training trajectory only
matches the pinned values because the order never changes.
