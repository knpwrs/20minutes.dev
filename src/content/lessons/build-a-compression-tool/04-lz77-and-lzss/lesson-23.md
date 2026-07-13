---
project: build-a-compression-tool
lesson: 23
title: Bounding the search window
overview: An unbounded match search is slow and its offsets can grow without limit. Today you cap how far back the matcher looks, keeping offsets inside a single byte and matching realistic - the classic sliding window.
goal: Limit findMatch to the last N bytes so matches farther back are not found.
spec:
  scenario: The window hides far-back matches
  status: failing
  lines:
    - kw: Given
      text: 'the buffer ABCDEABCDE and position 5, where the repeat ABCDE is 5 bytes back'
    - kw: When
      text: 'findMatch is called with a window of 4'
    - kw: Then
      text: 'it returns length 0, because the match starts just outside the 4-byte window'
    - kw: And
      text: 'with a window of 8 the same call returns offset 5, length 5, and every offset it returns is at most the window size'
code:
  lang: go
  source: |
    // only search starts within the last `window` bytes before pos
    lo := pos - window
    if lo < 0 { lo = 0 }
    for start := lo; start < pos; start++ {
      // ... same longest-match count as before ...
    }
    // window <= 255 keeps every offset representable in one byte
checkpoint: The matcher searches only a bounded sliding window. Commit and stop here.
---

Two problems come with an unbounded search: it gets slower the longer the input,
and its offsets can be arbitrarily large, so you cannot budget a fixed number of
bytes to store them. The **sliding window** fixes both by only searching the last
`window` bytes before the current position. Matches older than that are simply
invisible - a deliberate trade of a little compression for speed and bounded
offsets.

Concretely, clamp the search's lower bound to `pos - window`. In `ABCDEABCDE` the
`ABCDE` repeat sits five bytes back, so a window of `4` cannot see it and
`findMatch` returns length `0` - the bytes become literals. Widen the window to
`8` and the match reappears as `offset 5, length 5`. Choosing a window of at most
`255` guarantees every offset fits in a single byte, which keeps the distance
values small and easy to code later. Real DEFLATE uses a 32 KB window; ours is
smaller by design, a point for the caveats.
