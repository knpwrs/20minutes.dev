---
project: build-a-wav-pcm-toolkit
lesson: 24
title: Mono and stereo conversion
overview: Real tools constantly convert between mono and stereo - duplicating one channel into two, or folding two down to one. Today you build both directions, with the rounding that averaging demands.
goal: Convert mono to stereo by duplication and stereo to mono by averaging with rounding.
spec:
  scenario: Channel-count conversion duplicates or averages
  status: failing
  lines:
    - kw: Given
      text: 'the mono signal [100, 200]'
    - kw: When
      text: 'it is converted to stereo'
    - kw: Then
      text: 'both channels are [100, 200] - the mono signal duplicated'
    - kw: And
      text: 'folding stereo left [100, 3] and right [200, 4] to mono averages each frame to [150, 4] (3+4=7, 7/2=3.5, rounded half away from zero to 4)'
code:
  lang: go
  source: |
    func monoToStereo(m []int) [][]int {
      return [][]int{ append([]int{}, m...), append([]int{}, m...) }
    }
    func stereoToMono(l, r []int) []int {
      out := make([]int, len(l))
      for i := range l {
        // average with round-half-away-from-zero
        out[i] = roundHalfAway(float64(l[i]+r[i]) / 2)
      }
      return out
    }
checkpoint: You can convert between mono and stereo. Commit and stop here.
---

Converting **mono to stereo** is the easy direction: copy the single channel into
both left and right, so the sound sits dead center. `[100, 200]` becomes left
`[100, 200]` and right `[100, 200]`. (Panning it off-center is next lesson.) It is
just duplication, but make genuine copies so later edits to one channel do not bleed
into the other.

Folding **stereo to mono** is where the arithmetic bites: you **average** each
frame, `(left + right) / 2`. When the sum is even this is exact - `(100 + 200)/2 =
150` - but an odd sum lands on a half, and you must **round** deliberately. `(3 +
4)/2 = 3.5`, rounded half away from zero, is `4`; pick a rule and state it, because
truncation, round-half-up, and round-half-even each give subtly different audio and
a spec that just says "average" is ambiguous at the halves. This pins down the
rounding convention the whole toolkit uses whenever a sample computation is not
exact.
