---
project: build-a-tts-model
lesson: 38
title: 'Capstone: a learned-prosody synthesizer'
overview: 'The trained model can now replace a hand-written duration rule for a real segment. Today''s capstone predicts AY''s duration for "hi" and re-synthesizes it - and is honest about what that number does and does not prove.'
goal: 'Predict AY''s duration with the trained model, substitute it into the "hi" synthesis pipeline, and compare totals against the rule-based version.'
spec:
  scenario: 'Synthesizing hi with a learned AY duration'
  status: failing
  lines:
    - kw: Given
      text: 'lesson 37''s trained weights, approximately [113.6404863372, 42.0012199364, 45.5113931113], and the AY segment''s features [1, 1, 1] from lesson 35'
    - kw: When
      text: 'the trained model predicts AY''s duration'
    - kw: Then
      text: 'the prediction is approximately 201.1530993849 ms - converted to 3218 samples at 16000 samples per second - noticeably shorter than lesson 29''s hand-written rule of 302.4000 ms (4838 samples)'
    - kw: And
      text: 'this disagreement exists because lesson 34''s dataset is six invented rows, not measured speech - it is not evidence the learned duration is more correct; the point of this capstone is the mechanism, a fitted model standing in for a hand-tuned rule, not that 201 ms is a truer number for AY'
    - kw: And
      text: 'HH keeps its unchanged rule-based duration of 100.0000 ms (1600 samples), since the training dataset only ever covered vowels'
    - kw: And
      text: 'the full learned-prosody "hi" totals exactly 4818 samples, versus 6438 samples for lesson 32''s all-rule-based version'
code:
  lang: go
  source: |
    learnedAyMs := Predict(trainedWeights, FeaturesForSegment(aySegment))
    learnedAySamples := SamplesFor(sampleRate, learnedAyMs)
    // HH stays rule-based - the dataset never covered consonants
    total := hhSamples + learnedAySamples
checkpoint: 'This is the project''s capstone: a learned model now drives part of a real synthesizer''s prosody, and its disagreement with the hand-written rule is understood honestly, not mistaken for a better answer. Commit and stop for today.'
---

Every earlier lesson in this chapter built toward this moment: a trained
model that can stand in for a hand-written rule on a real segment. AY's
feature vector, `[1, 1, 1]`, is exactly what lesson 35 already computed, so
today's prediction needs nothing new to build - only lesson 37's trained
weights, dotted with those features, in place of lesson 29's stress-and-final
arithmetic.

The learned prediction, about 201 ms, disagrees with the hand-written rule's
302.4 ms by a wide margin, and it would be easy to read that as the model
having discovered something truer about how long AY should last. It has not:
lesson 34's dataset is six invented rows, not real measured speech, so a
model fit to it can only be as good as that invented table - nothing here
demonstrates that 201 ms is a better answer than 302.4 ms. What today
actually demonstrates is the **mechanism**: a fitted model can replace a
hand-tuned rule for the piece of the pipeline it was trained on, while HH's
duration stays rule-based, because the dataset never had anything to say
about consonants at all.
