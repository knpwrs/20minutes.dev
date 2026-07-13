---
project: build-sha-256
lesson: 19
title: Folding the block into the hash
overview: The compression function ends by adding the stirred working variables back into the hash state, word by word. Today you close that loop and pin the eight-word hash after compressing the "abc" block - which is already the "abc" digest.
goal: Add the working variables back into the hash state to produce the updated hash after one block.
spec:
  scenario: Compressing the "abc" block updates the hash state
  status: failing
  lines:
    - kw: Given
      text: 'the initial hash values H[0..7] and the working variables a..h after all 64 rounds of the "abc" block'
    - kw: When
      text: 'Compress folds them in: new H[0] = H[0] + a, new H[1] = H[1] + b, ..., new H[7] = H[7] + h (each modulo 2^32)'
    - kw: Then
      text: 'the updated hash is H[0]=0xba7816bf, H[1]=0x8f01cfea, H[2]=0x414140de, H[3]=0x5dae2223'
    - kw: And
      text: 'H[4]=0xb00361a3, H[5]=0x96177a9c, H[6]=0xb410ff61, H[7]=0xf20015ad'
code:
  lang: go
  source: |
    func Compress(h [8]uint32, block []byte) [8]uint32 {
      w := ExpandSchedule(block)
      a, b, c, d, e, f, g, hh := h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7]
      // ... run the 64 rounds over a..hh ...
      return [8]uint32{Add32(h[0], a), Add32(h[1], b), /* ... */ Add32(h[7], hh)}
    }
checkpoint: You can compress one block into an updated hash state. Commit and stop here.
---

The final step of compressing a block is deceptively small but essential: add each
stirred working variable back into the hash word it started from - `H[i] = H[i] +
working[i]`, modulo `2^32`. This "add the input back to the output" step (the
Davies-Meyer feed-forward) is what makes the compression function **one-way**.
Without it the 64 rounds are invertible - you could run them backward - but adding
the original state back destroys that, so there is no way to recover the block from
the result. Wrapping it up, `Compress(h, block)` expands the schedule, runs the 64
rounds on a copy of `h`, and folds the results back in.

For a single-block message like "abc", the hash after this one call is the finished
digest state: `0xba7816bf 0x8f01cfea 0x414140de 0x5dae2223 0xb00361a3 0x96177a9c
0xb410ff61 0xf20015ad`. Read those eight words as bytes and you have the famous
`ba7816bf...` SHA-256 of "abc". You have now built the entire per-block transform;
what remains is driving it across many blocks and serializing the result.
