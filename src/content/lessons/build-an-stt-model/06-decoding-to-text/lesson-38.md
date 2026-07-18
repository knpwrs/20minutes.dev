---
project: build-an-stt-model
lesson: 38
title: 'Capstone: audio in, text out'
overview: Every piece from lesson 1 onward already works. Today you wire them into one program that turns a synthesized signal into a state path and a per-frame symbol stream into text.
goal: Wire the whole pipeline into one entry point that prints lesson 25's Viterbi state path and lesson 36's decoded text from a single run.
spec:
  scenario: Running the full pipeline end to end
  status: failing
  lines:
    - kw: Given
      text: 'lesson 1''s synthesized 256-sample signal (64 samples of silence, 128 of the 1000 Hz tone, 64 more of silence), run through lesson 2 through lesson 14''s front end into 7 frames, and lesson 21 through lesson 25''s 3-state Viterbi model'
    - kw: When
      text: 'the program''s single entry point runs the whole front end and prints the best Viterbi state path'
    - kw: Then
      text: 'it prints the state path [0, 0, 1, 1, 1, 1, 1] - the exact path lesson 25 recovered by hand, now produced by one end-to-end run rather than lesson by lesson'
    - kw: And
      text: 'the same entry point also runs lesson 36''s greedy CTC decoder on lesson 34''s pinned 6-frame example, and prints its decoded text "AAB" alongside the state path - one program, two visible outputs'
code:
  lang: go
  source: |
    func main() {
      sig := SynthesizeSignal()             // lesson 1
      path := BestViterbiPath(sig)           // lessons 2-25, chained
      text := GreedyCTCDecode(RawSequence)   // lessons 34-36
      fmt.Println("Viterbi path:", path)
      fmt.Println("Decoded text:", text)
    }
checkpoint: Running this one program now prints both a Viterbi state path recovered from synthesized audio and a decoded piece of text - audio in, text out, the shape this whole project has been building toward. Commit and stop for today.
---

Every lesson from here back to lesson 1 already works; today's only job is calling them all from one entry point and looking at what comes out. Running the program takes the synthesized silence-tone-silence signal all the way through pre-emphasis, framing, the Hamming window, the DFT, the mel filterbank, log energies and the DCT into 7 frames of real MFCCs, then finds the best path through the 3-state acoustic model exactly as lesson 25 did - as one uninterrupted run instead of a sequence of hand-checked lessons.

Be honest with yourself about one seam here, the same kind the decoder half has. The front end really does compute MFCCs from the real signal, but the little 3-state model scores its trellis against the one-dimensional toy observation sequence the acoustic-model chapter trained on, not against those multi-dimensional MFCC vectors - nothing in this project ever bridges a six-number MFCC to the single scalar feature the toy HMM speaks. So the front end genuinely runs, and the Viterbi decode genuinely runs, but they meet at a scalar the chapters chose for clarity rather than at the MFCCs themselves. Wiring a real acoustic model that scores MFCC vectors directly is exactly the next step past this teaching version.

The same run also exercises the decoder half of the project: chapter 6's greedy CTC decode, applied to the pinned per-frame symbol example from lesson 34, prints `"AAB"` right alongside the state path. The two are shown together rather than literally chained end to end - this project's tiny 3-state tone model was never trained to output letters, only to segment a word into silence, onset and tone - but the pipeline that turns a raw signal into a state path, and the pipeline that turns a per-frame symbol stream into text, are the two halves every real speech recognizer needs, and you have now built and run both.
