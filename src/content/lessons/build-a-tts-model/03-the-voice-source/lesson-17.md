---
project: build-a-tts-model
lesson: 17
title: Voiced and unvoiced phonemes
overview: 'A phoneme''s Voiced feature from the inventory now decides which source excites it - a pulse train for voiced sounds, noise for unvoiced ones. Today you wire that dispatch up.'
goal: 'Dispatch a phoneme''s excitation source on its Voiced feature: a pulse train when voiced, scaled noise when unvoiced.'
spec:
  scenario: Dispatching excitation on the voiced feature
  status: failing
  lines:
    - kw: Given
      text: 'the phoneme S - unvoiced, a fricative - with amplitude 1.0 and a noise source fixed at 1.0'
    - kw: When
      text: it is excited for 5 samples
    - kw: Then
      text: 'the result is exactly 1, 1, 1, 1, 1 - unvoiced dispatch produces plain scaled noise, with no periodicity at all'
    - kw: Given
      text: 'the phoneme AA - voiced, a vowel - at F0 100 Hz, open quotient 0.6, amplitude 1.0'
    - kw: When
      text: it is excited for 5 samples
    - kw: Then
      text: 'the result is exactly 0, 0.0002677063, 0.0010705384, 0.0024076367, 0.0042775693 - voiced dispatch produces the rising edge of a pulse train instead'
code:
  lang: go
  source: |
    // dispatch on the Voiced feature from the phoneme inventory (lesson 10)
    if !p.Voiced {
      return ScaledNoise(sampleRate, n, amp, noise) // amp * noise.Sample(i) each sample
    }
    return PulseTrain(sampleRate, f0, oq, amp, n)
checkpoint: 'A phoneme''s own features now decide how it is excited - no more hardcoded pulse trains or noise, just a dispatch on Voiced. Commit and stop for today.'
---

Chapter 3 has now built both possible source signals - a pulse train and a
noise burst - but nothing yet decides which one a given phoneme should get.
That decision was actually made back in lesson 10: it is exactly the
`Voiced` feature already sitting on every entry in the phoneme inventory.
`S` is unvoiced, so it gets noise. `AA` is voiced, so it gets a pulse train.
No new information is needed - only a branch on a field that already exists.

This is the payoff for front-loading the inventory with features rather than
bare symbols: excitation does not need a special case for every phoneme,
just one `if p.Voiced` on a boolean that was already there. Voiced fricatives
like `Z` are a genuine middle case in real speech - folds buzzing and air
hissing at once - but today's dispatch keeps to the clean two-way split;
that subtlety is left for a fuller synthesizer to handle.
