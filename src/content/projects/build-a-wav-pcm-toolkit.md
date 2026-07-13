---
title: 'Build a WAV/PCM Toolkit'
order: 24
lessons: 31
size: 'Small'
tech: ['RIFF/WAV', 'PCM audio', 'Digital signal processing']
estMin: 20
desc: 'Read and write WAV files and shape PCM samples: gain, mixing, fades, and tone synthesis.'
blurb: 'Every lesson is one concrete spec with exact bytes or exact integer samples: the RIFF header pinned byte for byte, a 16-bit little-endian sample 00 80 decoding to -32768, the even-size padding byte after an odd data chunk, gain that clips at +32767 instead of wrapping, a mix sum that clamps, byteRate equal to sampleRate times blockAlign, a sine sample at a known phase with the rounding stated, and mono duplicated to stereo then averaged back with rounding. No real audio hardware, no external files - just bytes and samples you can assert.'
overview: |
  Over 31 lessons you build a working WAV/PCM toolkit from scratch: a library that reads and writes real WAV files and transforms raw PCM samples, with a small command-line tool on top. Everything is pinned to exact bytes and exact integer samples, so the toolkit you write behaves identically in any language and needs no audio hardware or sample files to test.

  You begin at the container level, walking the RIFF/WAVE format one chunk at a time - a four-byte id, a little-endian size, a payload - parsing the fmt chunk's fields, skipping chunks you do not recognise, and honouring the even-size padding byte. Then you decode PCM samples for every common depth (8-bit unsigned with its 128 bias, 16-bit and 24-bit signed little-endian, and 32-bit float), de-interleave stereo into per-channel slices, and turn the whole thing around to write valid files, proven correct by round-trip equality. On that foundation you add the sample math - gain with clipping, mixing with clamping, normalization to a target peak, linear fades, reversing, and channel conversions - then synthesize sine, square, and sawtooth tones, shape them with an ADSR-lite envelope, and add a delay echo. The capstone synthesizes a two-tone stereo signal, applies gain, a fade, and a mix, writes a 16-bit stereo WAV, and reads it back to confirm the exact samples and header.

  This is a teaching-grade toolkit built around uncompressed PCM in the classic RIFF/WAVE container. It decodes 8/16/24-bit integer and 32-bit float PCM and writes 16-bit PCM, but it deliberately stops short of the wider format: writing is 16-bit only, no compressed or ADPCM codecs, no WAVE_FORMAT_EXTENSIBLE channel masks, no cue/list/metadata chunk authoring, and no resampling or filtering beyond the effects you build. That honest core is exactly what production libraries like libsndfile and dr_wav extend with more codecs, formats, and streaming.
parts:
  - name: 'The RIFF/WAVE container'
    count: 7
  - name: 'Decoding PCM samples'
    count: 6
  - name: 'Writing a WAV'
    count: 5
  - name: 'Sample math and DSP'
    count: 7
  - name: 'Synthesis and the capstone'
    count: 6
caveats:
  note: "The toolkit reads and writes real 16-bit PCM WAV files end to end (verified against macOS's afinfo) with a working synthesize, transform, and inspect CLI, but write is 16-bit only, 32-bit float read is decoded yet not wired in, and there is no metadata, cue, or compressed-format support."
  future:
    - 'Wire 32-bit float decode into the sample reader dispatch and add a matching float encoder for true float round-trips'
    - 'Add 8-bit and 24-bit write encoders so files write back at their source bit depth instead of always converting to 16-bit'
    - 'Reject a short fmt chunk and a zero channel count at the parser itself, not only at the hardened read entry point'
    - 'Make gain, mix, delay, and normalize bit-depth-aware instead of always clamping to the 16-bit range'
    - 'Read and write basic LIST/INFO metadata and cue points'
    - 'Add WAVE_FORMAT_EXTENSIBLE support for more than two channels or non-standard channel masks'
resources:
  - title: 'WAVE PCM soundfile format'
    author: 'Stanford CCRMA'
    url: 'https://soundfile.sapp.org/doc/WaveFormat/'
    note: 'The single clearest one-page description of the canonical 44-byte WAV header - every field, its offset, size, and endianness, with the exact byte layout this project pins lesson by lesson.'
  - title: 'WAVEFORMATEX structure'
    author: 'Microsoft'
    url: 'https://learn.microsoft.com/en-us/windows/win32/api/mmreg/ns-mmreg-waveformatex'
    note: 'Microsoft''s authoritative definition of the fmt chunk fields (wFormatTag, nChannels, nSamplesPerSec, nAvgBytesPerSec, nBlockAlign, wBitsPerSample) and the derived-value rules the writing chapter reproduces.'
  - title: 'The Scientist and Engineer''s Guide to Digital Signal Processing'
    author: 'Steven W. Smith'
    url: 'https://www.dspguide.com/'
    note: 'A free, exceptionally readable DSP textbook - quantization, sampling, gain, mixing, and the math behind the synthesis and effects chapters, without assuming a signals background.'
  - title: 'Digital Audio Basics: Sample Rate and Bit Depth'
    author: 'Griffin Brown (iZotope)'
    url: 'https://www.izotope.com/en/learn/digital-audio-basics-sample-rate-and-bit-depth.html'
    note: 'A short primer on the two numbers that define PCM audio - sample rate and bit depth - and what quantization and clipping actually mean, useful orientation before the decoding chapter.'
  - title: 'Multimedia Programming Interface and Data Specifications 1.0 (RIFF)'
    author: 'IBM & Microsoft'
    url: 'https://www.tactilemedia.com/info/MCI_Control_Info.html'
    note: 'The original RIFF container specification: chunk structure, the four-byte id plus little-endian size plus payload, and the word-alignment padding rule that the container chapter implements.'
---
