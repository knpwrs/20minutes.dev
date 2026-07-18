---
project: build-an-stt-model
lesson: 7
title: The discrete Fourier transform
overview: A frame is samples over time; today's transform turns it into strength per frequency, the foundation the rest of this chapter builds on. You compute it the naive way, one frequency at a time, so the mechanics stay visible.
goal: Compute the naive discrete Fourier transform of a single frame and confirm the 1000 Hz tone lands cleanly on one bin.
spec:
  scenario: Transforming a frame of pure tone
  status: failing
  lines:
    - kw: Given
      text: 'the same 64 samples that lesson 3 calls frame 2 - samples 64 up to 128 - but taken directly from lesson 1''s raw synthesized signal, before lesson 2''s pre-emphasis and lesson 4''s Hamming window are applied to it'
    - kw: And
      text: 'the naive discrete Fourier transform X[k] is the sum over n from 0 to 63 of x[n] times cosine(-2*pi*k*n/64) for the real part, and x[n] times sine(-2*pi*k*n/64) for the imaginary part - computed directly, with no fast Fourier transform'
    - kw: When
      text: 'X is computed for every bin k from 0 to 63'
    - kw: Then
      text: 'bin 8''s imaginary part is -16.0 and its real part is smaller than 1e-9 in magnitude'
    - kw: And
      text: 'bins 0 through 7, 9 and 10 all have real and imaginary parts smaller than 1e-9 in magnitude - float noise, not an exact zero'
code:
  lang: go
  source: |
    // X[k] = sum_n x[n] * (cos(-2*pi*k*n/N) + i*sin(-2*pi*k*n/N)), naive O(N^2)
    func DFT(x []float64) []complex128 {
      n := len(x)
      out := make([]complex128, n)
      for k := 0; k < n; k++ {
        for t := 0; t < n; t++ {
          angle := -2 * math.Pi * float64(k) * float64(t) / float64(n)
          out[k] += complex(x[t]*math.Cos(angle), x[t]*math.Sin(angle))
        }
      }
      return out
    }
checkpoint: You can turn any frame into a spectrum one frequency at a time, and you have confirmed the tone lands exactly on bin 8. Commit and stop for today.
---

The discrete Fourier transform asks one question of a frame of samples: how much energy sits at each frequency? For each output bin `k` it multiplies every sample by a spinning unit vector at that frequency - cosine into the real part, sine into the imaginary part - and sums the result; a large magnitude means that frequency is strongly present. Computing all `N` bins this way costs `O(N^2)`, and that is deliberate: this project stops here rather than introducing the fast Fourier transform, a genuinely different and faster algorithm for the exact same numbers that exploits symmetries a naive sum ignores. Learning that trick well is its own project; today's goal is understanding the transform itself.

Today's frame is a special case, on purpose. It is samples 64 to 128 straight out of lesson 1's raw signal, before pre-emphasis or windowing ever touch them - which means all 8 whole cycles of the tone fit the frame with nothing spilling over the edges, so every bin but 8 comes out silent. From lesson 8 onward you go back to transforming the pipeline's actual frame, pre-emphasized and Hamming-windowed exactly as chapter 1 built it, and that windowing smears the same tone across bins 7, 8 and 9 instead of landing it on one. Today's clean answer is worth seeing once, precisely because tomorrow's will not look like it.
