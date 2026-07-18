---
title: Build a TTS Model
order: 58
lessons: 38
size: Medium
tech:
  - Formant synthesis
  - Phonemes
  - Prosody
estMin: 20
desc: 'Turn text into speech you can play: phonemes, a glottal source, formant filters, and learned prosody.'
blurb: 'Speech is a buzz from the vocal folds shaped by resonances in the mouth. Build both halves - a source and a filter - plus the text analysis that decides what to say and the prosody that decides how, and your program talks.'
overview: |
  A voice is two things multiplied together: a source, which is the buzz your
  vocal folds make, and a filter, which is the set of resonances your mouth and
  throat impose on that buzz. Change the filter and the same buzz becomes "ah"
  or "ee". This project builds a synthesizer on exactly that model, and the text
  analysis that drives it.

  You will start by making sound at all - samples, a sine, a wav file you can
  play. Then the front end: normalizing text, expanding numbers and
  abbreviations, and turning words into phonemes with a lexicon and
  letter-to-sound rules. Then the synthesizer itself: a glottal pulse train,
  noise for fricatives, biquad filters tuned to formant frequencies, and the
  transitions between them that make speech sound continuous rather than like
  beads on a string. The last chapter swaps your hand-written duration rules for
  a small model you train by gradient descent on a table of durations, so you
  can watch a learned model take over a job the rules were doing.

  What you end with is intelligible, and unmistakably synthetic - a robot voice
  in the tradition of the 1980s formant synthesizers, not a neural vocoder. That
  is the point: every sample it produces comes from arithmetic you wrote and can
  explain, which is not something you can say about a model that learned to
  speak from a thousand hours of audio.
parts:
  - name: Making sound
    count: 6
  - name: Text to phonemes
    count: 7
  - name: The voice source
    count: 6
  - name: The filter
    count: 8
  - name: Prosody and assembly
    count: 6
  - name: Learning the prosody
    count: 5
caveats:
  note: 'This is a working end-to-end Klatt-style formant synthesizer with a genuinely tiny, honestly-limited vocabulary - a five-word lexicon plus a crude letter-to-sound fallback - intelligible but robotic, not a modern neural TTS system.'
  future:
    - Wire the sentence intonation contour you build into the speech pipeline, which currently runs on a flat pitch
    - Grow the lexicon and the formant table together, since every new vowel needs its own formant data or the word cannot be pronounced
    - Spectrally shape the noise source so fricatives differ by place of articulation instead of all being the same white noise
    - Add formant or anti-formant targets for nasals so M, N and NG stop sounding like unfiltered vowels
    - Apply coarticulation smoothing across whole words, not just within a diphthong's own glide
    - Replace the duration model's six invented training rows with a real measured-speech dataset
resources:
  - title: 'Software for a cascade/parallel formant synthesizer'
    author: Dennis Klatt
    url: https://asa.scitation.org/doi/10.1121/1.383940
    note: The 1980 paper behind every formant synthesizer since, including this one.
  - title: Speech and Language Processing
    author: Daniel Jurafsky, James H. Martin
    url: https://web.stanford.edu/~jurafsky/slp3/
    note: The standard text. The speech synthesis and phonetics chapters are the relevant ones.
  - title: 'The Scientist and Engineer''s Guide to Digital Signal Processing'
    author: Steven W. Smith
    url: https://www.dspguide.com/
    note: Free, and the clearest explanation of filters you will find.
  - title: A Course in Phonetics
    author: Peter Ladefoged, Keith Johnson
    note: Where formant frequencies come from, and why vowels sit where they do.
  - title: Text-to-Speech Synthesis
    author: Paul Taylor
    note: A full treatment of the pipeline, front end through waveform.
---
