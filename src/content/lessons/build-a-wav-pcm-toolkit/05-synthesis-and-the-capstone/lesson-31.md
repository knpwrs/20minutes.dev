---
project: build-a-wav-pcm-toolkit
lesson: 31
title: 'Capstone: synthesize, shape, write, read'
overview: The finale drives the whole toolkit end to end - synthesize two tones, shape one with gain and a fade, mix them, write a stereo 16-bit WAV, and read it back to confirm the exact samples and header. Every chapter proves itself at once.
goal: Run the full pipeline and assert the round-tripped stereo samples and format exactly.
spec:
  scenario: The full pipeline round-trips a shaped stereo signal
  status: failing
  lines:
    - kw: Given
      text: 'a sine (1000 Hz, amp 10000, sr 4000, 4 samples) = [0,10000,0,-10000] and a sawtooth (1000 Hz, amp 8000, sr 4000, 4 samples) = [-8000,-4000,0,4000]'
    - kw: When
      text: 'the sine is gained by 0.5 then faded out (factor (N-n)/N) to make the left channel, the right channel is that left mixed with the sawtooth, and the stereo pair is written to a 16-bit 4000 Hz WAV and read back'
    - kw: Then
      text: 'the read-back left channel is [0, 3750, 0, -1250] and the right channel is [-8000, -250, 0, 2750]'
    - kw: And
      text: 'the read-back Format is numChannels 2, sampleRate 4000, bitsPerSample 16, blockAlign 4, byteRate 16000, with RIFF size 52 and data size 16'
code:
  lang: go
  source: |
    left := fadeOut(gain(sine(1000, 10000, 4000, 4), 0.5))  // [0,3750,0,-1250]
    saw := sawtooth(1000, 8000, 4000, 4)                     // [-8000,-4000,0,4000]
    right := mix(left, saw)                                  // [-8000,-250,0,2750]
    f := Format{NumChannels: 2, SampleRate: 4000, BitsPerSample: 16}
    file := WriteSamples(f, [][]int{left, right})
    gotF, chans, _ := ReadSamples(file)
    // chans[0]==left, chans[1]==right, gotF==f (byteRate 16000, blockAlign 4)
checkpoint: The whole toolkit runs end to end and round-trips exactly. The project is complete; commit and stop here.
---

This is the promise the project was built to keep: a real **WAV/PCM toolkit** that
makes sound, shapes it, writes it, and reads it back byte for byte. The pipeline
touches every chapter. Synthesis builds a sine and a sawtooth. Sample math shapes
them: the sine is halved by `gain` and tapered by `fadeOut` to `[0, 3750, 0,
-1250]`, which becomes the left channel; mixing that with the sawtooth (clamped, though
nothing here overflows) gives the right channel `[-8000, -250, 0, 2750]`.

Then the codec closes the loop. `WriteSamples` interleaves the two channels, encodes
them 16-bit, and wraps them in a valid file whose `data` size is `16` and whose RIFF
size is `52`; `ReadSamples` walks it back to the exact two channels and the exact
`Format`, with `blockAlign 4` and `byteRate 16000` derived correctly. Every value is
reproducible, no audio hardware or sample file involved. From four ASCII bytes read
off a header in lesson 1, you have built a genuine audio library - a RIFF/WAVE
reader and writer, a five-format PCM decoder, an interleaver, and a bank of DSP and
synthesis tools - the honest core that libraries like libsndfile wrap around. That
is a real toolkit, and it is yours.
