---
project: build-a-video-container-parser
lesson: 26
title: Duration in seconds
overview: A raw duration is meaningless without its timescale - together they give seconds, and a little formatting turns those seconds into a readable clock time. Today you compute and present a real duration, the first genuinely human-facing output the parser makes.
goal: Convert a duration and timescale into seconds, and format seconds as a minutes:seconds string.
spec:
  scenario: Duration becomes seconds and a readable clock
  status: failing
  lines:
    - kw: Given
      text: 'a track with mdhd duration 132300 and timescale 44100'
    - kw: When
      text: 'its duration in seconds is computed'
    - kw: Then
      text: 'it is exactly 3.0, and a movie with mvhd duration 5000 at timescale 1000 is exactly 5.0'
    - kw: And
      text: 'formatting seconds as minutes:seconds gives "0:03" for 3.0 and "2:05" for 125.0'
code:
  lang: go
  source: |
    // seconds = duration / timescale (as floating point)
    func seconds(duration uint64, timescale uint32) float64 {
      return float64(duration) / float64(timescale)
    }
    // format whole seconds as M:SS (minutes, zero-padded seconds)
    func formatDuration(sec float64) string { /* fill in */ }
checkpoint: You can report durations in seconds and as a clock. Commit and stop here.
---

Every duration in the file is expressed in **timescale units**, not seconds, so on
its own a number like `132300` says nothing. The conversion is simply
`duration / timescale`: at a timescale of `44100`, `132300` units is exactly `3.0`
seconds; at the movie's `1000` timescale, `5000` units is `5.0` seconds. The
division must be floating point, since durations rarely land on whole seconds.

A raw `3.0` is still not what a person wants to read, so the companion step formats
it as a clock: split the whole seconds into minutes and seconds and print
**minutes:zero-padded-seconds**, so `3.0` becomes `0:03` and `125.0` becomes `2:05`.
This is why `mvhd` and `mdhd` each carry their own timescale - a track's media clock
is independent of the movie clock - and both of these small functions feed straight
into the track summary you assemble next.
