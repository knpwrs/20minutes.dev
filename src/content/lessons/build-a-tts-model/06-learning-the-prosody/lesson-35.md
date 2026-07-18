---
project: build-a-tts-model
lesson: 35
title: 'Features for a duration model'
overview: 'A linear model needs numbers, not booleans, and a constant term to learn an intercept from. Today you turn each dataset row - and each real segment from chapter 5 - into a 3-element feature vector.'
goal: 'Build a Features function producing [1, stressed, final] for a dataset row or a real segment.'
spec:
  scenario: 'Converting dataset rows and real segments into feature vectors'
  status: failing
  lines:
    - kw: Given
      text: 'lesson 34''s six dataset rows, and chapter 5''s "hi" segments - AY, which is stressed and phrase-final, and HH, which is neither'
    - kw: When
      text: 'each is converted to a 3-element feature vector - a constant 1, then stressed as 0 or 1, then phrase-final as 0 or 1'
    - kw: Then
      text: 'row 0''s features are [1, 0, 0] and row 3''s are [1, 1, 1]'
    - kw: And
      text: 'the AY segment''s features are [1, 1, 1] - identical to row 3''s, since AY is both stressed and phrase-final'
    - kw: And
      text: 'the HH segment''s features are [1, 0, 0]'
code:
  lang: go
  source: |
    // the leading 1 is the "bias trick": it lets w0 act as a learned intercept
    func Features(ex DurationExample) [3]float64 {
      return [3]float64{1, ex.Stressed, ex.PhraseFinal}
    }
checkpoint: 'A dataset row - and, at prediction time, a phoneme''s own stressed and phrase-final facts - now produce the same shape of feature vector, ready for a linear model to consume. Commit and stop for today.'
---

A linear model predicts a number from a weighted sum of numbers, so
lesson 34's dataset - stressed, phrase-final, both already 0 or 1 - is
almost ready as-is. The one addition is a leading constant `1` on every
feature vector, the standard **bias trick**: without it, a linear model can
only pass through the origin, forcing zero stress and zero final-lengthening
to predict exactly zero duration. With a constant feature always equal to
`1`, its own weight becomes a learned intercept instead.

The real payoff is that this same `Features` function works on chapter 5's
actual segments, not just lesson 34's dataset rows. The AY segment from "hi"
is stressed and phrase-final, so its feature vector, `[1, 1, 1]`, is
identical to dataset row 3's - which is exactly what lets a model trained on
the dataset make a prediction for a real segment it never saw during
training.
