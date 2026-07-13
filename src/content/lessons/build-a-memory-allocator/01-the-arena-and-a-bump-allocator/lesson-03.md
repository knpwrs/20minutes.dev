---
project: build-a-memory-allocator
lesson: 3
title: Running out of space
overview: An allocator with finite memory must say no when it runs out. Today you make Alloc refuse a request that would spill past the end of the arena, returning an error instead of a bogus offset.
goal: Return an out-of-memory error when an allocation would exceed the arena.
spec:
  scenario: Allocating past the end of the arena fails
  status: failing
  lines:
    - kw: Given
      text: 'an arena of 16 bytes'
    - kw: When
      text: 'Alloc(16) is called, then Alloc(1) is called'
    - kw: Then
      text: 'the first succeeds and returns offset 0'
    - kw: And
      text: 'the second returns an out-of-memory error and does not move the cursor (Used stays 16)'
code:
  lang: go
  source: |
    func (a *Arena) Alloc(n int) (int, error) {
      // reject before bumping if it would not fit
      if a.cursor+n > len(a.buf) {
        return -1, errors.New("out of memory")
      }
      off := a.cursor
      a.cursor += n
      return off, nil
    }
checkpoint: The bump allocator refuses requests that would overflow the arena. Commit and stop here.
---

Every allocator has finite memory, so the interesting question is what it does at
the edge. A bump allocator is out of space the moment the cursor plus the request
would pass the end of the buffer. When that happens it must **refuse cleanly** -
return an error and leave the cursor exactly where it was - never hand back an
offset that points past the arena.

Pin the boundary now: filling the arena exactly (16 bytes into a 16-byte arena)
must still succeed, and it is only the *next* byte that fails. Check
`cursor + n > len(buf)` before bumping, so a request that fits right up to the last
byte is allowed and the first byte too many is rejected. Returning `-1` as the
offset alongside the error makes a misuse obvious if the caller ignores it.
