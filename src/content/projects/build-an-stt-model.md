---
title: Build an STT Model
order: 59
lessons: 38
size: Medium
tech:
  - MFCC
  - Viterbi
  - CTC
estMin: 20
desc: 'Turn speech into text: MFCCs, dynamic time warping, Viterbi decoding, and a trained acoustic model.'
blurb: 'Recognizing speech is turning a waveform into features that survive who is talking, then searching for the word sequence that best explains them. Build the whole path - front end, decoder, and a trained acoustic model.'
overview: |
  Speech recognition is two problems wearing a trenchcoat. The first is
  representation: a waveform is a terrible thing to compare, so you need
  features that keep what was said and throw away who said it. The second is
  search: given those features, find the most likely sequence of words - a
  problem with more candidate answers than you could ever enumerate, and a
  beautiful dynamic-programming solution.

  You will build the front end first: framing, windowing, a discrete Fourier
  transform, the mel scale, and the filterbank and cosine transform that turn a
  spectrum into MFCCs - the features that carried speech recognition for
  thirty years. Then recognition by template matching with dynamic time warping,
  then the real thing: states, a trellis, and Viterbi decoding in the log domain.
  The last chapters train an acoustic model by gradient descent and decode its
  output with CTC, including a beam search.

  What you finish with is every stage of a recognizer, each built and tested on
  its own: the MFCC front end running on real synthesized audio, template
  matching, Viterbi decoding, a trained acoustic model, and CTC. It is a
  teaching build, and honest about one seam - the tiny toy acoustic model scores
  a one-dimensional feature rather than the real MFCC vectors, so the front end
  and the decoders each work but do not yet chain into a single audio-to-text
  transcriber. Bridging that seam is the first thing you would do next, and the
  whole point is that you now understand exactly what a modern system does
  underneath, because its front end is nearly unchanged and its decoding problem
  is exactly the same one.
parts:
  - name: The signal
    count: 6
  - name: The spectrum
    count: 8
  - name: Matching templates
    count: 6
  - name: Sequence models
    count: 7
  - name: Learning the acoustic model
    count: 6
  - name: Decoding to text
    count: 5
caveats:
  note: 'Every stage - the MFCC front end, DTW matching, Viterbi decoding, a trained linear model, CTC decoding - works and is tested on its own, but the front end''s MFCCs never actually feed the decoders; they run on a hand-picked toy scalar sequence and a separate pinned example instead, so this is not yet an end-to-end audio-to-text recognizer.'
  future:
    - 'Bridge the front end to the decoder: score real MFCC vectors in the Viterbi step instead of a hand-picked scalar sequence - the single biggest gap'
    - Grow the acoustic model's training set beyond five hand-picked frames, ideally from real MFCC vectors
    - Feed the CTC decoder a symbol sequence derived from the tone's own MFCC frames instead of a fixed pinned example
    - Replace the naive O(n-squared) DFT with an FFT so it scales to realistic frame sizes
    - Accept real WAV or PCM audio input instead of only the one synthesized test tone
    - Expand the DTW recognizer's template library with templates taken from real word recordings
resources:
  - title: Speech and Language Processing
    author: Daniel Jurafsky, James H. Martin
    url: https://web.stanford.edu/~jurafsky/slp3/
    note: The standard text. The ASR and HMM chapters map closely onto this project.
  - title: 'A tutorial on hidden Markov models and selected applications in speech recognition'
    author: Lawrence Rabiner
    url: https://ieeexplore.ieee.org/document/18626
    note: The 1989 tutorial that taught a generation how Viterbi decoding works.
  - title: 'Connectionist Temporal Classification'
    author: Alex Graves et al.
    url: https://www.cs.toronto.edu/~graves/icml_2006.pdf
    note: The paper that introduced CTC and made end-to-end speech recognition practical.
  - title: 'The Scientist and Engineer''s Guide to Digital Signal Processing'
    author: Steven W. Smith
    url: https://www.dspguide.com/
    note: Free, and the clearest explanation of the DFT you will find.
  - title: 'Comparison of parametric representations for monosyllabic word recognition'
    author: Steven Davis, Paul Mermelstein
    url: https://ieeexplore.ieee.org/document/1163420
    note: The 1980 paper that introduced MFCCs.
---
