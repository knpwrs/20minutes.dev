---
project: build-an-stt-model
lesson: 11
title: The mel filterbank
overview: One triangle becomes a bank of eight once their edges are spaced evenly in mel rather than Hz, each filter widening with frequency the way hearing does. Today you build all eight and use them to condense a real power spectrum.
goal: Build the 8-filter mel filterbank and apply it to frame 2's real power spectrum from lesson 8.
spec:
  scenario: Building and applying the filterbank
  status: failing
  lines:
    - kw: Given
      text: 'the mel range 0 to 2146.0645275062 (lesson 9''s mel(0) to mel(4000)) split into 8 equally spaced filters, needing 10 edge points; each edge is converted back to Hz and then to a bin index with bin(f) = floor((nfft+1)*f/SampleRate), nfft=64'
    - kw: Then
      text: 'the 10 edge bins are 0, 1, 2, 5, 7, 10, 14, 19, 25, 32'
    - kw: When
      text: 'the 8 triangular filters are built from consecutive triples of these edges (as in lesson 10), and each is applied to lesson 8''s power spectrum of frame 2 by summing filter[k] times power[k] across all 33 bins'
    - kw: Then
      text: 'filter 3 (edges 5, 7, 10) captures 0.59336675 of energy, and filter 4 (edges 7, 10, 14) captures 0.29674191 - together almost the whole spectrum, because that is exactly where the tone''s energy sits'
    - kw: And
      text: 'the other six filters each capture less than 0.0001 - the near-silent bins on either side of the tone'
code:
  lang: go
  source: |
    // space 10 edges evenly in MEL between 0 and the Nyquist mel, then convert
    // each back to Hz with lesson 9's formula inverted:
    //   HzFromMel(m) = 700 * (pow(10, m/2595) - 1)
    // and to a bin with floor((nfft+1)*hz/sampleRate); each of the 8 filters is
    // lesson 10's triangle over three consecutive edges. Then apply the bank:
    func ApplyFilterbank(power []float64, filters [][]float64) []float64 {
      out := make([]float64, len(filters))
      for m, filt := range filters {
        for k, w := range filt {
          out[m] += w * power[k]
        }
      }
      return out
    }
checkpoint: A 33-number power spectrum is now 8 numbers, each one a mel-spaced band of real energy. Commit and stop for today.
---

Spacing eight filters' edges evenly across a mel range - rather than evenly across Hz - is what makes the filterbank narrow at low frequencies (where hearing is sensitive) and wide at high ones (where it is not). Converting a mel point back to Hz and then to a bin index reuses two things you already have: lesson 9's mel formula run backwards, and a floor-based bin lookup. Do that ten times (eight filters need ten shared edges, since each filter's right edge is its neighbour's center) and you get today's edge bins.

Applying the bank is the payoff: each filter's dot product with the power spectrum collapses 33 numbers into one, and doing that eight times turns today's frame into an 8-number description of where its energy sits, mel-band by mel-band. Watch how lopsided those eight numbers are for the tone frame - two filters carry essentially all of it, because the tone's energy really does sit in one place, and the filterbank's whole job is to say so without wasting effort on the emptier bands either side.
